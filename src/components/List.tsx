import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'
import theme from '../theme/theme'
import useTask from '../hooks/useTask'
import { ListType } from '../types'

type ListProps = {
  list: ListType
  onPress: () => void
}

export default function List({list, onPress}: ListProps) {
  const {isDarkMode} = useTask()
  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light

  const listContWidth = (Dimensions.get("screen").width - 58) / 2

  return (
    <TouchableOpacity 
      style={[
        styles.listContainer, {
        backgroundColor: isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.secondBaseColor.light,
        minWidth: listContWidth,
        maxWidth: listContWidth
      }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Text style={[styles.title, {color: textColor}]}>{list.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    borderRadius: 24,
    height: 160,
    overflow: "hidden",
    shadowOffset: { width: 4, height: 4 },
    shadowColor: theme.colors.black,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 12
  },
  title: {
    textAlign: "center",
    fontSize: theme.fontSizes.F18,
    fontWeight: "500"
  }
})