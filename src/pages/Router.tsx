import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Route, Routes } from 'react-router-native'

import theme from '../theme/theme'
import useTask from '../hooks/useTask'

import Layout from '../Layouts/Layout'
import LoadScreen from './LoadScreen'
import Main from './Main'
import TaskPage from './TaskPage'

export default function Router() {
  const {isDarkMode} = useTask()

  const bgcolor = isDarkMode ? theme.colors.baseColor.dark : theme.colors.baseColor.light

  return (
    <View style={[styles.container, {backgroundColor: bgcolor}]}>
      <Routes>
        <Route path='/' element={<LoadScreen/>} index/>
        <Route element={<Layout/>}>
          <Route path="/lists" element={<Main/>} />
          <Route path="/task/:taskId" element={<TaskPage/>} />
        </Route>
      </Routes>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
