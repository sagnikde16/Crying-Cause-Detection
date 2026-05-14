
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootTabs from './src/navigation/RootTabs';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <RootTabs />
      </SafeAreaProvider>
      <StatusBar style="light" />
    </PaperProvider>
  );
}
