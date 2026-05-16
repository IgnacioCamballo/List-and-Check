import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TaskProvider } from './src/context/TaskProvider';

import Router from './src/pages/Router';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TaskProvider>
          <Router />
        </TaskProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}