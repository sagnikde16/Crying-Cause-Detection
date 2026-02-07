
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Text, ActivityIndicator, MD2Colors } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

export default function AudioUploader({ onPrediction }) {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                console.log('Document picking canceled');
                return;
            }

            const asset = result.assets[0];
            setFileName(asset.name);
            uploadAudio(asset);

        } catch (err) {
            console.error('Error picking document:', err);
        }
    };

    const uploadAudio = async (asset) => {
        setLoading(true);
        // Determine API URL based on platform
        let apiUrl = 'http://localhost:5000/predict';
        if (Platform.OS === 'android') {
            apiUrl = 'http://10.0.2.2:5000/predict';
        }

        const formData = new FormData();

        if (Platform.OS === 'web') {
            if (asset.file) {
                formData.append('file', asset.file);
            } else {
                // Fallback if asset.file is missing (shouldn't happen on modern Expo web)
                // Fetch the blob from uri if needed, or error out
                try {
                    const res = await fetch(asset.uri);
                    const blob = await res.blob();
                    formData.append('file', blob, asset.name);
                } catch (e) {
                    console.error("Failed to fetch web blob", e);
                    alert("Failed to process file for upload.");
                    setLoading(false);
                    return;
                }
            }
        } else {
            formData.append('file', {
                uri: asset.uri,
                name: asset.name || 'upload.wav',
                type: asset.mimeType || 'audio/wav',
            });
        }

        try {
            console.log('Uploading file to', apiUrl);
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            onPrediction(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error connecting to backend');
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                icon="cloud-upload"
                onPress={pickDocument}
                loading={loading}
                disabled={loading}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                buttonColor="#6200ee"
                textColor="#ffffff"
            >
                Upload Audio File
            </Button>
            {fileName && (
                <View style={styles.fileContainer}>
                    <Text style={styles.fileName}>Selected: {fileName}</Text>
                </View>
            )}
            {loading && <ActivityIndicator animating={true} color={MD2Colors.red800} style={styles.loader} />}
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        alignItems: 'center',
        width: '100%',
    },

    button: {
        borderRadius: 25,
        elevation: 4,
    },
    buttonLabel: {
        fontSize: 16,
        paddingVertical: 5,
        fontWeight: 'bold',
    },
    fileContainer: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bbdefb',
    },
    fileName: {
        fontSize: 14,
        color: '#1565c0',
        fontWeight: '500',
    },
    loader: {
        marginTop: 10,
    }
});
