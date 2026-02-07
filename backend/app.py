import os
import io
import librosa
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_DIR = 'model'
SR = 22050

# Load models
print("Loading models...")
try:
    svm_model = joblib.load(os.path.join(MODEL_DIR, 'svm_model.pkl'))
    label_map = joblib.load(os.path.join(MODEL_DIR, 'label_map.pkl'))
    inv_label_map = joblib.load(os.path.join(MODEL_DIR, 'inv_label_map.pkl'))
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    svm_model = None

def preprocess_audio(file_stream):
    y, sr = librosa.load(file_stream, sr=SR)
    y, _ = librosa.effects.trim(y)
    return y, sr

def extract_features(y, sr):
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

@app.route('/predict', methods=['POST'])
def predict():
    if not svm_model:
        return jsonify({'error': 'Model not loaded'}), 500
        
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    try:
        y, sr = preprocess_audio(file)
        features = extract_features(y, sr)
        
        # Reshape for SVM (1, -1)
        features = features.reshape(1, -1)
        
        # Predict
        prediction_idx = svm_model.predict(features)[0]
        prediction_label = inv_label_map[prediction_idx]
        
        # Get probabilities
        probs = svm_model.predict_proba(features)[0]
        confidence = float(np.max(probs))
        
        return jsonify({
            'prediction': prediction_label,
            'confidence': confidence,
            'all_probabilities': {inv_label_map[i]: float(probs[i]) for i in range(len(probs))}
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
