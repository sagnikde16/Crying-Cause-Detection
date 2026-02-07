
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Text, Divider, useTheme, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AudioRecorder from '../components/AudioRecorder';
import AudioUploader from '../components/AudioUploader';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [prediction, setPrediction] = useState(null);
    const theme = useTheme();

    const handlePrediction = (result) => {
        setPrediction(result);
    };

    const resetPrediction = () => {
        setPrediction(null);
    };

    const getIconForPrediction = (pred) => {
        switch (pred?.toLowerCase()) {
            case 'hungry': return 'food-apple';
            case 'tired': return 'sleep';
            case 'belly_pain': return 'stomach';
            case 'burping': return 'baby-bottle-outline';
            case 'discomfort': return 'alert-circle-outline';
            case 'cold_hot': return 'thermometer';
            case 'lonely': return 'account-alert';
            case 'scared': return 'emoticon-frown';
            default: return 'baby-face-outline';
        }
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="Baby Cry Decoder" titleStyle={styles.headerTitle} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <Animatable.View animation="fadeInDown" duration={1000} style={styles.introContainer}>
                    <Text style={styles.introTitle}>Understanding Your Baby</Text>
                    <Text style={styles.introText}>
                        Babies cry to communicate. Record a cry or upload an audio file to find out if they are hungry, tired, or in pain.
                    </Text>
                </Animatable.View>

                {!prediction ? (
                    <Animatable.View animation="fadeInUp" duration={1000} delay={300}>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.cardTitle}>Analyze Audio</Title>
                                <View style={styles.actionContainer}>
                                    <View style={styles.section}>
                                        <Text style={styles.sectionLabel}>Record Now</Text>
                                        <AudioRecorder onPrediction={handlePrediction} />
                                    </View>

                                    <View style={styles.orContainer}>
                                        <Divider style={styles.divider} />
                                        <Text style={styles.orText}>OR</Text>
                                        <Divider style={styles.divider} />
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionLabel}>Upload File</Text>
                                        <AudioUploader onPrediction={handlePrediction} />
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </Animatable.View>
                ) : (
                    <Animatable.View animation="zoomIn" duration={800} style={styles.resultContainer}>
                        <Card style={[styles.card, styles.resultCard]}>
                            <LinearGradient
                                colors={['#ffffff', '#f0f4f8']}
                                style={styles.resultGradient}
                            >
                                <Card.Content style={styles.resultContent}>
                                    <Title style={styles.resultTitle}>Analysis Complete</Title>

                                    <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
                                        <IconButton
                                            icon={getIconForPrediction(prediction.prediction)}
                                            size={80}
                                            iconColor={theme.colors.primary}
                                            style={styles.resultIcon}
                                        />
                                    </Animatable.View>

                                    <View style={styles.predictionContainer}>
                                        <Text style={styles.predictionLabel}>Cause:</Text>
                                        <Text style={[styles.predictionValue, { color: theme.colors.primary }]}>
                                            {prediction.prediction}
                                        </Text>
                                    </View>

                                    <Paragraph style={styles.confidenceText}>
                                        Confidence: {(prediction.confidence * 100).toFixed(1)}%
                                    </Paragraph>

                                    {prediction.all_probabilities && (
                                        <View style={styles.probabilitiesContainer}>
                                            <Text style={styles.probTitle}>Other Possibilities:</Text>
                                            {Object.entries(prediction.all_probabilities)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(1, 4) // Top 3 other than the main one
                                                .map(([label, prob]) => (
                                                    <View key={label} style={styles.probRow}>
                                                        <Text style={styles.probLabel}>{label}</Text>
                                                        <View style={styles.probBarContainer}>
                                                            <View style={[styles.probBar, { width: `${prob * 100}%`, backgroundColor: theme.colors.primary }]} />
                                                        </View>
                                                        <Text style={styles.probValue}>{(prob * 100).toFixed(0)}%</Text>
                                                    </View>
                                                ))}
                                        </View>
                                    )}
                                </Card.Content>
                                <Card.Actions style={styles.cardActions}>
                                    <Button
                                        mode="contained"
                                        onPress={resetPrediction}
                                        style={styles.resetButton}
                                        icon="refresh"
                                    >
                                        Analyze Another Cry
                                    </Button>
                                </Card.Actions>
                            </LinearGradient>
                        </Card>
                    </Animatable.View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
    headerTitle: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 22,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    introContainer: {
        marginBottom: 30,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    introTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    introText: {
        textAlign: 'center',
        color: '#e0e0e0',
        fontSize: 16,
        lineHeight: 24,
    },
    card: {
        elevation: 8,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
    },
    cardTitle: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#3b5998',
        fontSize: 22,
        fontWeight: 'bold',
    },
    actionContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    section: {
        width: '100%',
        alignItems: 'center',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 10,
        color: '#aaa',
        fontWeight: 'bold',
    },
    resultContainer: {
        alignItems: 'center',
    },
    resultCard: {
        width: '100%',
        maxWidth: 400,
    },
    resultGradient: {
        width: '100%',
    },
    resultContent: {
        alignItems: 'center',
        paddingVertical: 25,
    },
    resultTitle: {
        fontSize: 24,
        color: '#333',
        marginBottom: 15,
        fontWeight: 'bold',
    },
    resultIcon: {
        margin: 0,
        backgroundColor: 'rgba(98, 0, 238, 0.1)',
    },
    predictionContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    predictionLabel: {
        fontSize: 16,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    predictionValue: {
        fontSize: 42,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginVertical: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    confidenceText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 25,
    },
    probabilitiesContainer: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    probTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#444',
        fontSize: 14,
    },
    probRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    probLabel: {
        width: 80,
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
    },
    probBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    probBar: {
        height: '100%',
        borderRadius: 4,
    },
    probValue: {
        width: 40,
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    cardActions: {
        justifyContent: 'center',
        paddingBottom: 25,
    },
    resetButton: {
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 25,
        elevation: 4,
    },
});
