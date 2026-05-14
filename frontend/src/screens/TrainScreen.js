import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const LABEL_OPTIONS = [
  'hungry',
  'tired',
  'belly_pain',
  'burping',
  'discomfort',
  'cold_hot',
  'lonely',
  'scared',
  'other',
];

export default function TrainScreen() {
  const [items, setItems] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(LABEL_OPTIONS[0]);
  const [pendingName, setPendingName] = useState(null);

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      setPendingName(asset.name);
    } catch (e) {
      console.error(e);
      Alert.alert('Pick failed', 'Could not read the file.');
    }
  };

  const addSample = () => {
    if (!pendingName) {
      Alert.alert('Choose a file', 'Pick an audio file first.');
      return;
    }
    const id = `${Date.now()}`;
    setItems((prev) => [
      { id, name: pendingName, label: selectedLabel },
      ...prev,
    ]);
    setPendingName(null);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const submitBatch = () => {
    Alert.alert(
      'Not connected yet',
      'Training runs on the server. This screen only collects labels locally for now.'
    );
  };

  return (
    <LinearGradient colors={colors.gradient} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.header}>Train the model</Text>
          <Text style={styles.sub}>
            Upload cry clips and assign labels. Data stays on this device until a training API exists.
          </Text>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Add a sample</Title>
              <Paragraph style={styles.para}>
                {pendingName ? `Selected: ${pendingName}` : 'No file selected.'}
              </Paragraph>

              <Button
                mode="outlined"
                icon="file-music-outline"
                onPress={pickAudio}
                style={styles.btn}
                textColor={colors.accentDeep}
              >
                Pick audio
              </Button>

              <Text style={styles.labelHeading}>Label</Text>
              <View style={styles.chips}>
                {LABEL_OPTIONS.map((l) => (
                  <Chip
                    key={l}
                    selected={selectedLabel === l}
                    onPress={() => setSelectedLabel(l)}
                    style={styles.chip}
                    selectedColor={colors.accentDeep}
                  >
                    {l.replace(/_/g, ' ')}
                  </Chip>
                ))}
              </View>

              <Button
                mode="contained"
                onPress={addSample}
                style={styles.addBtn}
                buttonColor={colors.accentDeep}
              >
                Add to local batch
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Batch ({items.length})</Title>
              <Paragraph style={styles.paraMuted}>
                Review samples before a future “send to server” action.
              </Paragraph>
              <Divider style={styles.divider} />
              {items.length === 0 ? (
                <Text style={styles.empty}>No samples yet.</Text>
              ) : (
                items.map((row) => (
                  <View key={row.id} style={styles.row}>
                    <View style={styles.rowText}>
                      <Text numberOfLines={1} style={styles.fileName}>
                        {row.name}
                      </Text>
                      <Text style={styles.tag}>{row.label}</Text>
                    </View>
                    <IconButton
                      icon="close"
                      size={20}
                      onPress={() => removeItem(row.id)}
                      iconColor={colors.textSoft}
                    />
                  </View>
                ))
              )}
              <Button
                mode="contained-tonal"
                onPress={submitBatch}
                disabled={items.length === 0}
                style={styles.submitBtn}
              >
                Submit for training (placeholder)
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textOnGradient,
    marginBottom: 8,
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  card: {
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: colors.surfaceCard,
    elevation: 3,
  },
  cardTitle: { color: colors.textDark, fontSize: 18 },
  para: { color: colors.textDark, marginBottom: 12 },
  paraMuted: { color: colors.textSoft, marginBottom: 8, fontSize: 13 },
  btn: { marginBottom: 16, borderColor: colors.borderSoft },
  labelHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSoft,
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: { marginRight: 8, marginBottom: 8 },
  addBtn: { borderRadius: 10 },
  divider: { marginVertical: 12, backgroundColor: colors.borderSoft },
  empty: { color: colors.textSoft, fontStyle: 'italic', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  rowText: { flex: 1 },
  fileName: { color: colors.textDark, fontWeight: '600' },
  tag: {
    fontSize: 12,
    color: colors.accentDeep,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  submitBtn: { marginTop: 12, borderRadius: 10 },
});
