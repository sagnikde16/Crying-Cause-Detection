import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function AuthDashboardScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [session, setSession] = useState(null);

  const mockLogin = () => {
    setSession({ email: email || 'demo@example.com', name: name || 'Demo user' });
    setMode('dashboard');
  };

  const mockSignup = () => {
    setSession({ email: email || 'new@example.com', name: name || 'New user' });
    setMode('dashboard');
  };

  const logout = () => {
    setSession(null);
    setMode('login');
    setPassword('');
  };

  return (
    <LinearGradient colors={colors.gradient} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.header}>Account</Text>
            <Text style={styles.sub}>
              Sign in, create an account, or view your dashboard. No server yet — this is UI only.
            </Text>

            {!session ? (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.toggleRow}>
                    <Button
                      mode={mode === 'login' ? 'contained' : 'outlined'}
                      onPress={() => setMode('login')}
                      style={[styles.toggleBtn, styles.toggleBtnSpacing]}
                      buttonColor={mode === 'login' ? colors.accentDeep : undefined}
                      textColor={mode === 'login' ? '#fff' : colors.textDark}
                    >
                      Log in
                    </Button>
                    <Button
                      mode={mode === 'signup' ? 'contained' : 'outlined'}
                      onPress={() => setMode('signup')}
                      style={styles.toggleBtn}
                      buttonColor={mode === 'signup' ? colors.accentDeep : undefined}
                      textColor={mode === 'signup' ? '#fff' : colors.textDark}
                    >
                      Sign up
                    </Button>
                  </View>

                  <Divider style={styles.divider} />

                  {mode === 'signup' && (
                    <TextInput
                      label="Name"
                      value={name}
                      onChangeText={setName}
                      mode="outlined"
                      style={styles.input}
                      outlineColor={colors.borderSoft}
                      activeOutlineColor={colors.accentDeep}
                    />
                  )}
                  <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    outlineColor={colors.borderSoft}
                    activeOutlineColor={colors.accentDeep}
                  />
                  <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    outlineColor={colors.borderSoft}
                    activeOutlineColor={colors.accentDeep}
                  />

                  {mode === 'login' ? (
                    <Button
                      mode="contained"
                      onPress={mockLogin}
                      style={styles.primaryBtn}
                      buttonColor={colors.accentDeep}
                    >
                      Continue (demo)
                    </Button>
                  ) : (
                    <Button
                      mode="contained"
                      onPress={mockSignup}
                      style={styles.primaryBtn}
                      buttonColor={colors.accentDeep}
                    >
                      Create account (demo)
                    </Button>
                  )}
                </Card.Content>
              </Card>
            ) : (
              <Card style={styles.card}>
                <Card.Content>
                  <Title style={styles.cardTitle}>Dashboard</Title>
                  <Paragraph style={styles.para}>
                    Signed in as <Text style={styles.bold}>{session.name}</Text>
                  </Paragraph>
                  <Paragraph style={styles.paraMuted}>{session.email}</Paragraph>

                  <View style={styles.statsRow}>
                    <View style={[styles.statBox, styles.statBoxSpacing]}>
                      <Text style={styles.statNum}>—</Text>
                      <Text style={styles.statLabel}>Analyses</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statNum}>—</Text>
                      <Text style={styles.statLabel}>Saved</Text>
                    </View>
                  </View>

                  <Paragraph style={styles.hint}>
                    When the backend is ready, this area can show history and preferences.
                  </Paragraph>

                  <Button mode="outlined" onPress={logout} textColor={colors.accentDeep}>
                    Log out
                  </Button>
                </Card.Content>
              </Card>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 32 },
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
    marginBottom: 20,
  },
  card: {
    borderRadius: 18,
    backgroundColor: colors.surfaceCard,
    elevation: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  toggleBtn: { flex: 1 },
  toggleBtnSpacing: { marginRight: 10 },
  divider: { marginVertical: 16, backgroundColor: colors.borderSoft },
  input: { marginBottom: 12, backgroundColor: colors.surface },
  primaryBtn: { marginTop: 8, borderRadius: 10 },
  cardTitle: { color: colors.textDark, marginBottom: 8 },
  para: { color: colors.textDark, marginBottom: 4 },
  paraMuted: { color: colors.textSoft, marginBottom: 16 },
  bold: { fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
  },
  statBoxSpacing: { marginRight: 12 },
  statNum: { fontSize: 22, fontWeight: '700', color: colors.accentDeep },
  statLabel: { fontSize: 12, color: colors.textSoft, marginTop: 4 },
  hint: {
    fontSize: 13,
    color: colors.textSoft,
    marginBottom: 16,
    lineHeight: 19,
  },
});
