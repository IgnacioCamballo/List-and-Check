import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { Route, Routes } from 'react-router-native'

import theme from '../theme/theme'
import useTask from '../hooks/useTask'

import Layout from '../Layouts/Layout'
import LoadScreen from './LoadScreen'
import Main from './Main'
import TaskPage from './TaskPage'

export default function Router() {
  const {isDarkMode} = useTask()

  const bgColorStyleValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current

  const bgColorStyles = {
    backgroundColor: bgColorStyleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.baseColor.light, theme.colors.baseColor.dark]
    })
  }

  useEffect(() => {
    Animated.timing(bgColorStyleValue, {
      toValue: isDarkMode ? 1 : 0,
      duration: 100,
      useNativeDriver: false
    }).start()
  }, [isDarkMode])
  

  const bgcolor = isDarkMode ? theme.colors.baseColor.dark : theme.colors.baseColor.light

  return (
    <Animated.View style={[styles.container, bgColorStyles]}>
      <Routes>
        <Route path='/' element={<LoadScreen/>} index/>
        <Route element={<Layout/>}>
          <Route path="/lists" element={<Main/>} />
          <Route path="/task/:taskId" element={<TaskPage/>} />
        </Route>
      </Routes>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
