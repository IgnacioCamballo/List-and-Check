import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'

import useTask from '../hooks/useTask'
import type { RootStackParamList } from '../navigation/types'

export default function TaskPage() {
  const route = useRoute<RouteProp<RootStackParamList, 'TaskPage'>>()
  const { lists } = useTask()

  const selectedList = lists.find((list) => list.id === route.params.listId)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedList?.title ?? 'Lista no encontrada'}</Text>
      <Text style={styles.subtitle}>ID: {route.params.listId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16
  }
})
