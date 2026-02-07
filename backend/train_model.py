import os
import kagglehub
import librosa
import numpy as np
import soundfile as sf
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
from tqdm import tqdm
import random

# Configuration
DATASET_SOURCE = 'mennaahmed23/baby-cry-dataset'
PROCESSED_DATASET_DIR = 'dataset_processed'
MODEL_DIR = 'model'
SR = 22050 # Librosa default
TARGET_SAMPLES = 20 



def download_dataset():
    print("Downloading dataset...")
    # Check for existing cache first to avoid re-download/lock issues
    cache_path = os.path.join(os.path.expanduser("~"), ".cache", "kagglehub", "datasets", "mennaahmed23", "baby-cry-dataset", "versions", "2")
    if os.path.exists(cache_path):
        print(f"Found dataset in cache: {cache_path}")
        return cache_path

    try:
        path = kagglehub.dataset_download(DATASET_SOURCE)
        print(f"Dataset downloaded to: {path}")
        return path
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        if os.path.exists(cache_path):
             print(f"Found dataset in cache (fallback): {cache_path}")
             return cache_path
        raise e

def augment_audio(y, sr):
    choice = random.choice(["noise", "stretch", "pitch", "volume"])
    if choice == "noise":
        noise = np.random.randn(len(y))
        return y + 0.005 * noise
    elif choice == "stretch":
        try:
            rate = random.uniform(0.9, 1.1)
            return librosa.effects.time_stretch(y=y, rate=rate)
        except: 
            return y
    elif choice == "pitch":
        try:
            steps = random.choice([-1, 1])
            return librosa.effects.pitch_shift(y=y, sr=sr, n_steps=steps)
        except:
            return y
    elif choice == "volume":
        scale = random.uniform(0.8, 1.2)
        return y * scale
    return y

def preprocess_and_augment(dataset_path):
    print("Preprocessing and augmenting data...")
    input_dir = os.path.join(dataset_path, 'Baby Cry Sence Dataset')
    if not os.path.exists(input_dir):
        potential_dirs = [d for d in os.listdir(dataset_path) if os.path.isdir(os.path.join(dataset_path, d))]
        if potential_dirs:
            input_dir = os.path.join(dataset_path, potential_dirs[0])
        else:
            print(f"Searching in {dataset_path}...")
            # specific fix for the dataset structure if needed
            for root, dirs, files in os.walk(dataset_path):
                 if 'Baby Cry Sence Dataset' in dirs:
                     input_dir = os.path.join(root, 'Baby Cry Sence Dataset')
                     break
    
    if not os.path.exists(input_dir): 
         raise FileNotFoundError(f"Could not find dataset directory in {dataset_path}")

    os.makedirs(PROCESSED_DATASET_DIR, exist_ok=True)
    
    classes = [d for d in os.listdir(input_dir) if os.path.isdir(os.path.join(input_dir, d))]
    print(f"Classes found: {classes}")

    for label in classes:
        input_class_path = os.path.join(input_dir, label)
        output_class_path = os.path.join(PROCESSED_DATASET_DIR, label)
        os.makedirs(output_class_path, exist_ok=True)

        files = [f for f in os.listdir(input_class_path) if f.endswith(".wav")]
        current_count = len(files)
        print(f"Processing {label}: {current_count} files found.")

        # Copy/Process original files
        files_to_process = files[:TARGET_SAMPLES]
        for f in files_to_process:
            try:
                y, sr = librosa.load(os.path.join(input_class_path, f), sr=SR)
                # Trim silence
                y, _ = librosa.effects.trim(y)
                
                # Fixed length 5s (approx 110250 samples)
                max_len = SR * 5
                if len(y) > max_len:
                    y = y[:max_len]
                else:
                    y = np.pad(y, (0, max_len - len(y)))
                
                sf.write(os.path.join(output_class_path, f), y, SR)
            except Exception as e:
                print(f"Error processing {f}: {e}")

        # Augment
        if current_count < TARGET_SAMPLES:
            print(f"Augmenting {label} to {TARGET_SAMPLES} samples...")
            idx = 0
            while current_count < TARGET_SAMPLES:
                file = random.choice(files)
                try:
                    y, sr = librosa.load(os.path.join(input_class_path, file), sr=SR)
                    y = librosa.effects.trim(y)[0]
                    y_aug = augment_audio(y, sr)
                    
                    max_len = SR * 5
                    if len(y_aug) > max_len:
                        y_aug = y_aug[:max_len]
                    else:
                        y_aug = np.pad(y_aug, (0, max_len - len(y_aug)))
                    
                    out_name = f"aug_{idx}_{file}"
                    sf.write(os.path.join(output_class_path, out_name), y_aug, SR)
                    idx += 1
                    current_count += 1
                except Exception as e:
                     # print(f"Error augmenting {file}: {e}")
                     pass

def extract_features_from_audio(y, sr):
    # MFCCs
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    mfcc_mean = np.mean(mfcc, axis=1)
    
    # Chroma
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean = np.mean(chroma, axis=1)
    
    # Mel Spectrogram
    mel = librosa.feature.melspectrogram(y=y, sr=sr)
    mel_mean = np.mean(mel, axis=1)
    
    # Contrast
    contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    contrast_mean = np.mean(contrast, axis=1)
    
    # Tonnetz
    tonnetz = librosa.feature.tonnetz(y=librosa.effects.harmonic(y), sr=sr)
    tonnetz_mean = np.mean(tonnetz, axis=1)
    
    return np.concatenate((mfcc_mean, chroma_mean, mel_mean, contrast_mean, tonnetz_mean))

def extract_dataset_features():
    print("Extracting features using Librosa...")
    
    X = []
    y = []
    label_map = {}
    label_id = 0

    classes = [d for d in os.listdir(PROCESSED_DATASET_DIR) if os.path.isdir(os.path.join(PROCESSED_DATASET_DIR, d))]
    
    for label in classes:
        if label not in label_map:
            label_map[label] = label_id
            label_id += 1
        
        class_path = os.path.join(PROCESSED_DATASET_DIR, label)
        print(f"Extracting features for {label}...")
        
        for file in tqdm(os.listdir(class_path)):
            if not file.endswith(".wav"):
                continue
            
            file_path = os.path.join(class_path, file)
            try:
                audio, sr = librosa.load(file_path, sr=SR)
                features = extract_features_from_audio(audio, sr)
                X.append(features)
                y.append(label_map[label])
            except Exception as e:
                print(f"Error extracting features for {file}: {e}")

    return np.array(X), np.array(y), label_map

def train_model(X, y, label_map):
    print("Training SVM model...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("svm", SVC(kernel="rbf", C=10, gamma="scale", class_weight="balanced", probability=True))
    ])
    
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    # Evaluate
    y_pred = pipeline.predict(X_test)
    inv_label_map = {v: k for k, v in label_map.items()}
    # Fix: Ensure all labels in y_test are present in target_names
    unique_labels = sorted(list(set(y_test) | set(y_pred)))
    target_names = [inv_label_map[i] for i in unique_labels if i in inv_label_map]
    
    print(classification_report(y_test, y_pred, labels=unique_labels, target_names=target_names))
    
    print("Saving model and label map...")
    joblib.dump(pipeline, os.path.join(MODEL_DIR, 'svm_model.pkl'))
    joblib.dump(label_map, os.path.join(MODEL_DIR, 'label_map.pkl'))
    joblib.dump(inv_label_map, os.path.join(MODEL_DIR, 'inv_label_map.pkl'))
    print("Model saved successfully.")

if __name__ == "__main__":
    dataset_path = download_dataset()
    preprocess_and_augment(dataset_path)
    X, y, label_map = extract_dataset_features()
    if len(X) > 0:
        train_model(X, y, label_map)
    else:
        print("No features extracted. Check dataset.")
