
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Text, Divider, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AudioRecorder from '../components/AudioRecorder';
import AudioUploader from '../components/AudioUploader';
import { colors } from '../theme/colors';

export default function HomeScreen() {
    const [prediction, setPrediction] = useState(null);

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
            colors={colors.gradient}
            style={styles.container}
        >
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="Baby Cry Decoder" titleStyle={styles.headerTitle} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <Animatable.View animation="fadeInDown" duration={1000} style={styles.introContainer}>
                    <View style={styles.introGlass}>
                        <Text style={styles.introTitle}>Understanding your baby</Text>
                        <Text style={styles.introText}>
                            Babies cry to communicate. Record a cry or upload an audio file to get a gentle read on hunger, tiredness, or discomfort.
                        </Text>
                    </View>
                </Animatable.View>

                <View style={styles.heroRow}>
                    <View style={styles.heroFrame}>
                        <Image
                            source={require('../../assets/icon.png')}
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.heroFrame}>
                        <Image
                            source={require('../../assets/splash-icon.png')}
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

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
                                colors={[colors.surfaceCard, colors.surface]}
                                style={styles.resultGradient}
                            >
                                <Card.Content style={styles.resultContent}>
                                    <Title style={styles.resultTitle}>Analysis Complete</Title>

                                    <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
                                        <IconButton
                                            icon={getIconForPrediction(prediction.prediction)}
                                            size={80}
                                            iconColor={colors.accent}
                                            style={styles.resultIcon}
                                        />
                                    </Animatable.View>

                                    <View style={styles.predictionContainer}>
                                        <Text style={styles.predictionLabel}>Cause:</Text>
                                        <Text style={[styles.predictionValue, { color: colors.accent }]}>
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
                                                            <View style={[styles.probBar, { width: `${prob * 100}%`, backgroundColor: colors.accent }]} />
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
                                        buttonColor={colors.accentDeep}
                                        icon="refresh"
                                    >
                                        Analyze another cry
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
        color: colors.textOnGradient,
        fontWeight: 'bold',
        fontSize: 22,
    },
    content: {
        padding: 20,
        paddingBottom: 88,
    },
    heroRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    heroFrame: {
        width: 112,
        height: 112,
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 7,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.22)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    introContainer: {
        marginBottom: 18,
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    introGlass: {
        width: '100%',
        maxWidth: 420,
        paddingVertical: 18,
        paddingHorizontal: 18,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.18)',
    },
    introTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.textOnGradient,
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 8,
    },
    introText: {
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 15,
        lineHeight: 23,
    },
    card: {
        elevation: 6,
        borderRadius: 22,
        backgroundColor: colors.surfaceCard,
        overflow: 'hidden',
        shadowColor: '#1a2a24',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
    },
    cardTitle: {
        textAlign: 'center',
        marginBottom: 20,
        color: colors.textDark,
        fontSize: 21,
        fontWeight: '700',
        letterSpacing: 0.2,
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
        fontSize: 12,
        fontWeight: '700',
        color: colors.textSoft,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
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
        backgroundColor: colors.borderSoft,
    },
    orText: {
        marginHorizontal: 10,
        color: colors.textSoft,
        fontWeight: '600',
        fontSize: 12,
        letterSpacing: 1,
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
        fontSize: 22,
        color: colors.textDark,
        marginBottom: 15,
        fontWeight: '700',
    },
    resultIcon: {
        margin: 0,
        backgroundColor: colors.accentMuted,
    },
    predictionContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    predictionLabel: {
        fontSize: 13,
        color: colors.textSoft,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontWeight: '600',
    },
    predictionValue: {
        fontSize: 36,
        fontWeight: '700',
        textTransform: 'capitalize',
        marginVertical: 6,
        letterSpacing: 0.3,
    },
    confidenceText: {
        fontSize: 16,
        color: colors.textSoft,
        marginBottom: 22,
    },
    probabilitiesContainer: {
        width: '100%',
        backgroundColor: colors.surface,
        padding: 15,
        borderRadius: 14,
        marginTop: 10,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    probTitle: {
        fontWeight: '700',
        marginBottom: 12,
        color: colors.textDark,
        fontSize: 13,
        letterSpacing: 0.2,
    },
    probRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    probLabel: {
        width: 80,
        fontSize: 13,
        color: colors.textSoft,
        textTransform: 'capitalize',
    },
    probBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: colors.accentMuted,
        borderRadius: 6,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    probBar: {
        height: '100%',
        borderRadius: 6,
    },
    probValue: {
        width: 40,
        fontSize: 12,
        color: colors.textSoft,
        textAlign: 'right',
    },
    cardActions: {
        justifyContent: 'center',
        paddingBottom: 25,
    },
    resetButton: {
        paddingHorizontal: 22,
        paddingVertical: 4,
        borderRadius: 22,
        elevation: 2,
    },
});
