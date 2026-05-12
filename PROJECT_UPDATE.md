# Project update

Short snapshot of what exists today and what is still open.

## Built

- **ML pipeline:** Train script (`train_model.py`) that pulls data, extracts audio features, and saves an SVM + label maps under `backend/model/`.
- **Inference API:** Flask app with CORS, `/health`, and `/predict` (upload audio → JSON with label, confidence, per-class probabilities).
- **Client app:** Expo (React Native + web) UI app with apk build to record or pick audio and call the API; basic wiring via `frontend/constants.js` (`API_URL`).

## To do

- **Login and authorization:** User accounts, secure sessions or tokens, and protected routes (none of this exists yet).
- **Feedback:** Let users confirm or correct predictions and send that signal back (UI + API + optional storage).
- **Database integration:** Persist users, predictions, feedback, and any history.
- **Cloud deploy of ML model:** Host the backend (and model artifacts) on a managed service so the app does not depend on a local `localhost:5000` machine; set stable `API_URL` / env per environment.
