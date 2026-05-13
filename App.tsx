import React from 'react';
import { StatusBar } from 'react-native';
import { NativeRouter, useLocation } from 'react-router-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TaskProvider } from './src/context/TaskProvider';
import useTask from './src/hooks/useTask';

import Router from './src/pages/Router';

//function created to be able to use context variable
function InsideApp() {
  const { configInfo, isDarkMode } = useTask()
  const { pathname } = useLocation()
  const statusBarColor = pathname === "/" ? "#ffffff" : configInfo.baseColor
  const statusBarTextStyle = pathname === "/" ? 'dark-content' : isDarkMode ? 'light-content' : 'dark-content'
  
  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarTextStyle}/>
      <Router />
    </>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <NativeRouter>
          <TaskProvider>
            <InsideApp />
          </TaskProvider>
        </NativeRouter>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}