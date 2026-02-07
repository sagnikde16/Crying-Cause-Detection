# Code Cell
!pip install kagglehub
========================================
# Code Cell
# IMPORTANT: RUN THIS CELL IN ORDER TO IMPORT YOUR KAGGLE DATA SOURCES,
# THEN FEEL FREE TO DELETE THIS CELL.
# NOTE: THIS NOTEBOOK ENVIRONMENT DIFFERS FROM KAGGLE'S PYTHON
# ENVIRONMENT SO THERE MAY BE MISSING LIBRARIES USED BY YOUR
# NOTEBOOK.

import kagglehub
mennaahmed23_baby_cry_dataset_path = kagglehub.dataset_download('mennaahmed23/baby-cry-dataset')

print('Data source import complete.')

========================================
# Code Cell
import pandas as pd
import numpy as np
import matplotlib.pylab as plt
import seaborn as sns
from glob import glob

import librosa
import librosa.display
import IPython.display as ipd
import soundfile as sf
import random

========================================
# Code Cell
DATASET_PATH = "/kaggle/input/baby-cry-dataset/Baby Cry Sence Dataset"      # root folder
OUTPUT_SPEC_PATH = "/content/melspecs" # where spectrograms will be saved
CSV_PATH = "/content/labels.csv"

SAMPLE_RATE = 22050
N_MELS = 128
MAX_DURATION = 5  # seconds (pad or trim)

========================================
# Code Cell
audio_files=glob('/kaggle/input/baby-cry-dataset/Baby Cry Sence Dataset/hungry/*.wav')
audio_files2=glob('/kaggle/input/baby-cry-dataset/Baby Cry Sence Dataset/cold_hot/*.wav')
========================================
# Code Cell
import os
# Fix: Use the correct local path for Colab instead of /kaggle/input/
actual_dataset_path = os.path.join(mennaahmed23_baby_cry_dataset_path, 'Baby Cry Sence Dataset')
audio_files = glob(os.path.join(actual_dataset_path, 'hungry/*.wav'))

if audio_files:
    display(ipd.Audio(audio_files[0]))
else:
    print(f"No files found at: {os.path.join(actual_dataset_path, 'hungry/')}")
========================================
# Code Cell
ipd.Audio(audio_files2[0])
========================================
# Code Cell
y,sr=librosa.load(audio_files[0])
print(f'y:{y[:10]}')
print(f'shape y:{y.shape}')
print(f'sr:{sr}')
========================================
# Code Cell
y2,sr2=librosa.load(audio_files2[0])
print(f'y2:{y2[:10]}')
print(f'shape y2:{y2.shape}')
print(f'sr2:{sr2}')
========================================
# Code Cell
pd.Series(y).plot(figsize=(10,5),lw=1,title='raw audio hungry')
========================================
# Code Cell
pd.Series(y2).plot(figsize=(10,5),lw=1,title='raw audio cold hot')
========================================
# Code Cell
D=librosa.stft(y) #short fourier transform
S_db=librosa.amplitude_to_db(np.abs(D),ref=np.max)
S_db.shape
========================================
# Code Cell
#plot
fig,ax = plt.subplots(figsize=(10,5))
img=librosa.display.specshow(S_db,
                            x_axis='time',
                            y_axis='log',
                            ax=ax)
ax.set_title('Spectogram of hungry audio')
fig.colorbar(img,ax=ax,format=f'%0.2f')
========================================
# Code Cell
D2=librosa.stft(y2) #short fourier transform
S_db2=librosa.amplitude_to_db(np.abs(D2),ref=np.max)
S_db2.shape
========================================
# Code Cell
#plot
fig,ax = plt.subplots(figsize=(10,5))
img=librosa.display.specshow(S_db2,
                            x_axis='time',
                            y_axis='log',
                            ax=ax)
ax.set_title('spectogram of hot_cold audio')
fig.colorbar(img,ax=ax,format=f'%0.2f')

========================================
# Code Cell
S=librosa.feature.melspectrogram(y=y,sr=sr,n_mels=128*2,)
S.shape
S_db_mel=librosa.amplitude_to_db(S,ref=np.max)
========================================
# Code Cell
#plot
fig,ax = plt.subplots(figsize=(10,5))
img=librosa.display.specshow(S_db_mel,
                            x_axis='time',
                            y_axis='log',
                            ax=ax)
ax.set_title('mel spectogram of hungry audio')
fig.colorbar(img,ax=ax,format=f'%0.2f')
========================================
# Code Cell
S2=librosa.feature.melspectrogram(y=y2,sr=sr2,n_mels=128*2,)
S2.shape
S_db_mel2=librosa.amplitude_to_db(S2,ref=np.max)
========================================
# Code Cell
#plot
fig,ax = plt.subplots(figsize=(10,5))
img=librosa.display.specshow(S_db_mel2,
                            x_axis='time',
                            y_axis='log',
                            ax=ax)
ax.set_title('mel spectogram of hot_cold audio')
fig.colorbar(img,ax=ax,format=f'%0.2f')
========================================
# Code Cell
data_info = []

for label in os.listdir(DATASET_PATH):
    class_path = os.path.join(DATASET_PATH, label)
    if not os.path.isdir(class_path):
        continue

    for file in os.listdir(class_path):
        if file.endswith(".wav"):
            file_path = os.path.join(class_path, file)
            y, sr = librosa.load(file_path, sr=None)
            duration = librosa.get_duration(y=y, sr=sr)

            data_info.append({
                "label": label,
                "file": file,
                "duration_sec": duration
            })

df = pd.DataFrame(data_info)
========================================
# Code Cell
plt.figure(figsize=(8,5))
sns.countplot(x="label", data=df)
plt.title("Class Distribution (Imbalance Check)")
plt.xlabel("Class")
plt.ylabel("Number of Samples")
plt.show()
========================================
# Code Cell
plt.figure(figsize=(8,5))
sns.boxplot(x="label", y="duration_sec", data=df)
plt.title("Audio Duration Distribution per Class")
plt.ylabel("Duration (seconds)")
plt.show()
========================================
# Code Cell
def plot_waveforms(dataset_path, n_samples=2):
    plt.figure(figsize=(6,12))
    i = 1

    for label in os.listdir(dataset_path):
        class_path = os.path.join(dataset_path, label)
        if not os.path.isdir(class_path):
            continue

        files = [f for f in os.listdir(class_path) if f.endswith(".wav")]
        files = np.random.choice(files, min(n_samples, len(files)), replace=False)

        for file in files:
            y, sr = librosa.load(os.path.join(class_path, file), sr=None)
            plt.subplot(len(os.listdir(dataset_path)), n_samples, i)
            librosa.display.waveshow(y, sr=sr)
            plt.title(f"{label}")
            plt.tight_layout()
            i += 1

    plt.show()

plot_waveforms(DATASET_PATH)

========================================
# Code Cell
def plot_spectrograms(dataset_path, n_samples=1):
    plt.figure(figsize=(40,60))
    i = 1

    for label in os.listdir(dataset_path):
        class_path = os.path.join(dataset_path, label)
        if not os.path.isdir(class_path):
            continue

        files = [f for f in os.listdir(class_path) if f.endswith(".wav")]
        files = np.random.choice(files, min(n_samples, len(files)), replace=False)

        for file in files:
            y, sr = librosa.load(os.path.join(class_path, file), sr=None)
            S = librosa.feature.melspectrogram(y=y, sr=sr)
            S_dB = librosa.power_to_db(S, ref=np.max)

            plt.subplot(len(os.listdir(dataset_path)), n_samples, i)
            librosa.display.specshow(S_dB, sr=sr, x_axis='time', y_axis='mel')
            plt.colorbar(format="%+2.0f dB")
            plt.title(f"Mel Spectrogram - {label}")
            plt.tight_layout()
            i += 1

    plt.show()

plot_spectrograms(DATASET_PATH)
========================================
# Code Cell
print("\n📊 DATASET SUMMARY")
print(df.groupby("label").agg(
    samples=("file", "count"),
    avg_duration=("duration_sec", "mean"),
    min_duration=("duration_sec", "min"),
    max_duration=("duration_sec", "max")
))
========================================
# Code Cell
OUTPUT_DIR = "dataset_augmented"
TARGET_SAMPLES = 100
SR = 16000
INPUT_DIR = "/kaggle/input/baby-cry-dataset/Baby Cry Sence Dataset"
os.makedirs(OUTPUT_DIR, exist_ok=True)
========================================
# Code Cell
def add_noise(y, noise_factor=0.005):
    noise = np.random.randn(len(y))
    return y + noise_factor * noise

def time_stretch(y, rate):
    return librosa.effects.time_stretch(y=y, rate=rate)

def pitch_shift(y, sr, n_steps):
    return librosa.effects.pitch_shift(y=y, sr=sr, n_steps=n_steps)

def volume_scale(y, scale):
    return y * scale
========================================
# Code Cell
def augment_audio(y, sr):
    choice = random.choice(["noise", "stretch", "pitch", "volume"])

    if choice == "noise":
        return add_noise(y)

    elif choice == "stretch":
        rate = random.uniform(0.9, 1.1)
        return time_stretch(y, rate)

    elif choice == "pitch":
        steps = random.choice([-1, 1])
        return pitch_shift(y, sr, steps)

    elif choice == "volume":
        scale = random.uniform(0.8, 1.2)
        return volume_scale(y, scale)
========================================
# Code Cell
for label in os.listdir(INPUT_DIR):
    input_class_path = os.path.join(INPUT_DIR, label)
    output_class_path = os.path.join(OUTPUT_DIR, label)

    if not os.path.isdir(input_class_path):
        continue

    os.makedirs(output_class_path, exist_ok=True)

    files = [f for f in os.listdir(input_class_path) if f.endswith(".wav")]
    current_count = len(files)

    # Copy original files first
    for f in files:
        y, sr = librosa.load(os.path.join(input_class_path, f), sr=SR)
        sf.write(os.path.join(output_class_path, f), y, sr)

    if current_count >= TARGET_SAMPLES:
        print(f"✔ {label}: {current_count} samples (no augmentation needed)")
        continue

    print(f"🔄 Augmenting {label}: {current_count} → {TARGET_SAMPLES}")

    idx = 0
    while current_count < TARGET_SAMPLES:
        file = random.choice(files)
        y, sr = librosa.load(os.path.join(input_class_path, file), sr=SR)

        y_aug = augment_audio(y, sr)

        # Ensure fixed length (7s approx)
        max_len = SR * 7
        if len(y_aug) > max_len:
            y_aug = y_aug[:max_len]
        else:
            y_aug = np.pad(y_aug, (0, max_len - len(y_aug)))

        out_name = f"aug_{idx}_{file}"
        sf.write(os.path.join(output_class_path, out_name), y_aug, sr)

        idx += 1
        current_count += 1
========================================
# Code Cell
from transformers import Wav2Vec2Processor, Wav2Vec2Model
import torch
from tqdm import tqdm
========================================
# Code Cell
DATASET_DIR = "dataset_augmented"
OUTPUT_DIR = "embeddings"
SR = 16000

os.makedirs(OUTPUT_DIR, exist_ok=True)
========================================
# Code Cell
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)
========================================
# Code Cell
processor = Wav2Vec2Processor.from_pretrained(
    "facebook/wav2vec2-base-960h"
)
model = Wav2Vec2Model.from_pretrained(
    "facebook/wav2vec2-base-960h"
).to(device)

model.eval()
========================================
# Code Cell
X = []
y = []
label_map = {}

label_id = 0
========================================
# Code Cell
with torch.no_grad():
    for label in os.listdir(DATASET_DIR):
        class_path = os.path.join(DATASET_DIR, label)
        if not os.path.isdir(class_path):
            continue

        if label not in label_map:
            label_map[label] = label_id
            label_id += 1

        print(f"Processing class: {label}")

        for file in tqdm(os.listdir(class_path)):
            if not file.endswith(".wav"):
                continue

            file_path = os.path.join(class_path, file)

            # Load audio
            audio, sr = librosa.load(file_path, sr=SR)

            # Wav2Vec input
            inputs = processor(
                audio,
                sampling_rate=SR,
                return_tensors="pt",
                padding=True
            )

            inputs = {k: v.to(device) for k, v in inputs.items()}

            # Forward pass
            outputs = model(**inputs)

            # Mean pooling over time
            embedding = outputs.last_hidden_state.mean(dim=1)

            X.append(embedding.cpu().numpy().squeeze())
            y.append(label_map[label])

========================================
# Code Cell
X = np.array(X)
y = np.array(y)

np.save(os.path.join(OUTPUT_DIR, "X.npy"), X)
np.save(os.path.join(OUTPUT_DIR, "y.npy"), y)
np.save(os.path.join(OUTPUT_DIR, "label_map.npy"), label_map)

print("\n✅ Embedding extraction complete")
print("Embeddings shape:", X.shape)
print("Labels shape:", y.shape)
print("Classes:", label_map)
========================================
# Code Cell
import numpy as np

X = np.load("embeddings/X.npy")
y = np.load("embeddings/y.npy")

print("Any NaNs?", np.isnan(X).any())
print("Mean:", X.mean(), "Std:", X.std())
print("Class counts:", np.bincount(y))
========================================
# Code Cell
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score
)
========================================
# Code Cell
X = np.load("embeddings/X.npy")
y = np.load("embeddings/y.npy")
label_map = np.load("embeddings/label_map.npy", allow_pickle=True).item()

inv_label_map = {v: k for k, v in label_map.items()}

print("X shape:", X.shape)
print("y shape:", y.shape)
========================================
# Code Cell
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,
    random_state=42
)
========================================
# Code Cell
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("svm", SVC(
        kernel="rbf",
        C=10,
        gamma="scale",
        class_weight="balanced"
    ))
])
========================================
# Code Cell
pipeline.fit(X_train, y_train)
========================================
# Code Cell
y_pred = pipeline.predict(X_test)
========================================
# Code Cell
macro_f1 = f1_score(y_test, y_pred, average="macro")
print("\n✅ Macro F1 Score:", macro_f1)

print("\n📄 Classification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=[inv_label_map[i] for i in sorted(inv_label_map)]
))
========================================
# Code Cell
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(8,6))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=[inv_label_map[i] for i in sorted(inv_label_map)],
    yticklabels=[inv_label_map[i] for i in sorted(inv_label_map)]
)
plt.xlabel("Predicted")
plt.ylabel("True")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.show()
========================================
# Code Cell
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_scores = cross_val_score(
    pipeline,
    X,
    y,
    cv=cv,
    scoring="f1_macro"
)

print("\n📊 Cross-validation Macro-F1 scores:")
print(cv_scores)
print("Mean CV Macro-F1:", cv_scores.mean())
========================================
# Code Cell
from sklearn.metrics import accuracy_score

acc = accuracy_score(y_test, y_pred)
print("Accuracy:", acc)

========================================
# Code Cell
from sklearn.metrics import f1_score, accuracy_score

# Train predictions
y_train_pred = pipeline.predict(X_train)

train_f1 = f1_score(y_train, y_train_pred, average="macro")
test_f1 = f1_score(y_test, y_pred, average="macro")

train_acc = accuracy_score(y_train, y_train_pred)
test_acc = accuracy_score(y_test, y_pred)

print(f"Train Macro-F1: {train_f1:.3f}")
print(f"Test  Macro-F1: {test_f1:.3f}")

print(f"Train Accuracy: {train_acc:.3f}")
print(f"Test  Accuracy: {test_acc:.3f}")

========================================
