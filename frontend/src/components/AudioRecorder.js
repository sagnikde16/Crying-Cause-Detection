import { API_URL } from '../../constants.js';
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { ActivityIndicator, Text, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function AudioRecorder({ onPrediction }) {
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // Web specific refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  async function startRecording() {
    try {
      if (Platform.OS === 'web') {
        startRecordingWeb();
      } else {
        startRecordingNative();
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function startRecordingNative() {
    if (permissionResponse.status !== 'granted') {
      console.log('Requesting permission..');
      await requestPermission();
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    console.log('Starting recording..');
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    setIsRecording(true);
    console.log('Recording started');
  }

  const startRecordingWeb = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        uploadAudioWeb(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log('Web recording started');
    } catch (err) {
      console.error("Error accessing microphone on web:", err);
      alert("Microphone access denied or not supported.");
    }
  };

  async function stopRecording() {
    console.log('Stopping recording..');
    setIsRecording(false);

    if (Platform.OS === 'web') {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } else {
      if (recording) {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        uploadAudioNative(uri);
      }
    }
  }

  const uploadAudioNative = async (uri) => {
    setLoading(true);
    // Use localhost for emulator, but for physical device use your IP
    // For web on same machine, localhost works. 
    // For Android Emulator, 10.0.2.2 points to host localhost.
    let apiUrl = `${API_URL}/predict`;

    let formData = new FormData();
    formData.append('file', {
      uri,
      name: 'recording.m4a',
      type: 'audio/m4a',
    });

    try {
      console.log('Uploading to', apiUrl);
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response.data);
      onPrediction(response.data);
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const uploadAudioWeb = async (blob) => {
    setLoading(true);
    let apiUrl = `${API_URL}/predict`;
    console.log(blob);
    let formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    try {
      console.log('Uploading blob to', apiUrl);
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response.data);
      onPrediction(response.data);
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <LinearGradient
          colors={isRecording ? colors.recordActive : colors.recordIdle}
          style={styles.gradientButton}
        >
          <View style={styles.innerContent}>
            <Icon
              source={isRecording ? "stop" : "microphone"}
              size={40}
              color="white"
            />
            <Text style={styles.buttonLabel}>
              {isRecording ? 'Stop' : 'Record'}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      {loading && <ActivityIndicator animating={true} color={colors.accentDeep} style={styles.loader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  touchable: {
    borderRadius: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  gradientButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  loader: {
    marginTop: 20,
  }
});
