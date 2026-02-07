
try:
    import librosa
    import numpy as np
    print(f"Librosa version: {librosa.__version__}")
    y = np.random.rand(1000)
    mfcc = librosa.feature.mfcc(y=y, sr=22050)
    print(f"MFCC shape: {mfcc.shape}")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"Error: {e}")
