import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import theme from '../theme/theme'
import useTask from '../hooks/useTask'
import { ListType } from '../types'

type ListProps = {
  list: ListType
}

export default function List({list}: ListProps) {
  const {isDarkMode} = useTask()

  const listContWidth = (Dimensions.get("screen").width - 58) / 2

  return (
    <View 
      style={[
        styles.listContainer, {
        backgroundColor: isDarkMode ? theme.colors.listColor.dark : theme.colors.listColor.light,
        borderColor: list.borderColor,
        minWidth: listContWidth,
        maxWidth: listContWidth
      }]}
    >
      <Text style={styles.title}>{list.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
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