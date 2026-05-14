import {API_URL} from '../../constants.js'
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { colors } from '../theme/colors';

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
        let apiUrl = `${API_URL}/predict`;

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
                buttonColor={colors.uploadButton}
                textColor={colors.surfaceCard}
            >
                Upload Audio File
            </Button>
            {fileName && (
                <View style={styles.fileContainer}>
                    <Text style={styles.fileName}>Selected: {fileName}</Text>
                </View>
            )}
            {loading && <ActivityIndicator animating={true} color={colors.accentDeep} style={styles.loader} />}
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
        padding: 10,
        backgroundColor: colors.accentMuted,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    fileName: {
        fontSize: 13,
        color: colors.accentDeep,
        fontWeight: '600',
    },
    loader: {
        marginTop: 10,
    }
});
