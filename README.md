# Crying Cause Detection

Machine-learning prototype that classifies infant cry audio (for example hungry, pain, discomfort, tired) using acoustic features. This repo includes a **Flask** inference API and an **Expo (React Native)** client for recording or uploading audio and viewing predictions.

## Live deployment

- **App (web):** _https://crying-cause-detection.vercel.app/_  
 **App** built is also complete but not yet published. 
---

## To Run App locally follow given steps

## Prerequisites

- **Python** 3.10+ (3.x recommended)
- **Node.js** LTS (18 or newer works well with Expo SDK 54)
- **npm** (bundled with Node)
- **Git**

On Windows, use PowerShell or Command Prompt. On macOS/Linux, adjust the virtual-environment activation command as noted below.

---

## Run locally

Run the **backend first**, then the **frontend**. The API listens on **port 5000** by default (`http://localhost:5000`).

### 1. Backend (Flask API)

1. **Open a terminal** and go to the backend folder:

   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment** (recommended):

   - Windows (PowerShell):

     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```

   - macOS / Linux:

     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Provide trained model files** under `backend/model/`:

   - `svm_model.pkl`
   - `label_map.pkl`
   - `inv_label_map.pkl`

   If you do not have these yet, generate them by training (see **Training the model** below).

5. **Start the server** (from the `backend` directory so paths like `model/` resolve correctly):

   ```bash
   python app.py
   ```

6. **Verify** the API is up:

   - Open `http://localhost:5000/health` in a browser — you should see a JSON status response.
   - Predictions are posted as multipart form data to `POST http://localhost:5000/predict` with the audio file in the `file` field.

### 2. Frontend (Expo app)

1. **Open a second terminal** and go to the frontend folder:

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Point the app at your API** (if needed):

   - For **web** or **simulator on the same machine**, `frontend/constants.js` can keep `http://localhost:5000` as `API_URL`.
   - For a **physical phone** on the same Wi‑Fi, replace `localhost` with your computer’s LAN IP (for example `http://192.168.1.10:5000`) so the device can reach the Flask server.

4. **Start Expo:**

   ```bash
   npm start
   ```

   Then press `w` for web, or scan the QR code for Expo Go on a device (see Expo CLI prompts).

5. **Use the app** to record or upload cry audio; it calls `${API_URL}/predict` and shows the predicted label and confidence.

---

## Training the model (optional)

From `backend/` with your virtual environment active:

1. Configure **Kaggle** credentials if required by `kagglehub` for the dataset download (see [Kaggle API documentation](https://www.kaggle.com/docs/api)).
2. Run:

   ```bash
   python train_model.py
   ```

This downloads/processes data and writes `svm_model.pkl`, `label_map.pkl`, and `inv_label_map.pkl` into `backend/model/`. Training can take a while depending on dataset size and machine.

---

## Project layout (short)

- `backend/app.py` — Flask app: `/health`, `/predict`
- `backend/train_model.py` — dataset + SVM training pipeline
- `frontend/` — Expo (React Native + web) UI
- `report.md` — phase-1 write-up and context

---

## Future plans and development goals

- **Production deployment:** Publish the Expo app (web and/or app stores) and host the API behind HTTPS with environment-based configuration and Authorisation setup for user sign in.
- **Real-time capture:** Polish in-app recording flows, handle more audio formats, and tighten error handling when the backend or model is unavailable.
- **Model improvements:** Expand and diversify training data; experiment with architectures beyond the current SVM pipeline; add calibration and uncertainty where useful.
- **User feedback loop:** Let caregivers confirm or correct predictions and log outcomes (with privacy considerations) to support retraining and evaluation.
- **History and insights:** Optional cry history, trends over time, and gentle guidance text — always framed as supportive, not medical advice.
- **Accessibility and trust:** Clear disclaimers, offline fallbacks where possible, and transparent confidence scores.

---

## Disclaimer

This tool is for research and educational support only. It is **not** a medical device and does not replace professional care. Always consult a qualified clinician for health concerns.
