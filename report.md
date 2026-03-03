# Crying Cause Detection: Project Phase 1 Report

## 1. Introduction and The Barebones Idea

Infant crying is the primary mode of communication for babies, and interpreting the cause—whether it is hunger, pain, discomfort, or something else—can be a daunting challenge for parents and caregivers. The primary idea behind this project is to develop a machine learning-based system capable of analyzing infant crying audio to classify the underlying cause. By providing a relatively reliable indicator of *why* an infant is crying, this tool aims to alleviate stress for parents and help address the infant's needs more effectively.

In Phase 1, the objective is to build a foundational model that processes audio signals and categorizes them into distinct classes based on their acoustic properties.

## 2. Classification Labels and Mel Spectrogram Representations

Based on the dataset, we aim to categorize the cries into distinct labels, typically including:

1.  **Hungry:** Often features a rhythmic, repetitive pattern. The pitch might be moderate and consistent.
2.  **Pain:** Usually characterized by a sudden, high-pitched, and intense sound, followed by a brief pause (breath-holding), and then another loud wail.
3.  **Discomfort (e.g., wet diaper):** May be less intense than a pain cry, often sounding like a grumble or whine that builds up over time.
4.  **Tired/Sleepy:** Tends to be a softer, more breathy cry, interspersed with yawns or whimpers.

The core of the audio analysis relies on transforming raw audio signals into **Mel Spectrograms**. A Mel Spectrogram is a visual representation of the audio's frequency spectrum over time, mapped to the Mel scale (which approximating human hearing). 

### How Mel Spectrograms Differ by Label
*   **Hungry:** The spectrogram often shows distinct, evenly spaced energy bands, reflecting the rhythmic nature of the cry.
*   **Pain:** The spectrogram will present sudden spikes in high-frequency energy, followed by brief periods of low energy (the pause).
*   **Discomfort:** Shows a gradual increase in energy, often concentrated in mid-to-high frequency bands, with less rhythmicity than the hungry cry.
*   **Tired/Sleepy:** Characterized by lower overall energy and flatter, less distinct frequency peaks compared to pain or hunger cries.

*(Note: Insert plots showing typical Mel Spectrograms for each class here.)*

## 3. Data Source and Datasets

The effectiveness of the model relies heavily on the quality and diversity of the audio data. Our primary datasets for this project are sourced from established infant cry repositories and crowdsourced contributions where the cause of crying is annotated.

*   **Donate-a-Cry Dataset:** A comprehensive dataset featuring audio recordings of infant cries labeled with reasons such as hunger, pain, tired, belly pain, and burping. 
*   **(Mention any other specific datasets used, e.g., ESC-50 if adapted, or custom collected data).**

The data undergoes preprocessing, which involves cleaning (removing silence or background noise) and converting the raw `.wav` files into Mel Spectrograms using libraries like Librosa before being fed into the machine learning model.

## 4. Hosting: Server Setup and How-To

To make the model accessible, it logic is currently exposed via a backend server.

### How to Run Locally / Connect to the Server

1.  **Environment Setup:** 
    *   Ensure Python 3.x is installed.
    *   Install the required dependencies from the project root:
        ```bash
        pip install -r backend/requirements.txt
        ```
2.  **Running the Backend:**
    *   Navigate to the backend directory.
    *   Execute the main application script (e.g., if using Flask/FastAPI):
        ```bash
        python app.py  # Replace with actual script name if different
        ```
    *   The server typically runs on `http://localhost:5000` or `http://localhost:8000`.
3.  **Using the API:**
    *   You can send a POST request with an audio file to the model's prediction endpoint (e.g., `/predict`).
    *   The backend will process the audio, extract the Mel spectrogram, pass it through the trained Support Vector Machine (SVC) model, and return a JSON response with the predicted label.

## 5. Future Work (Timeline: 3-4 Weeks)

The next major phase is to transition this analytical model into an accessible, user-friendly tool.

### Output as a Mobile Application
Over the next 3-4 weeks, the primary goal is to develop a mobile application (the frontend components are currently underway in `frontend/App.js` using React Native or a similar framework). 

**Key features for the app will include:**
*   **Real-time Audio Capture:** Allowing users to record the baby's cry directly through the app.
*   **Instant Analysis:** seamless integration with the backend server to provide near-instantaneous predictions.
*   **User Feedback Loop:** A feature for parents to confirm or correct the model's prediction, which could be used for future model fine-tuning.
*   **Logging:** A history tracker of the infant's cries and predicted needs.

This application will bridge the gap between complex machine learning audio analysis and practical, everyday utility for parents.
