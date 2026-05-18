import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import theme from '../theme/theme'
import { Layout, ListType } from '../types'
import useTask from '../hooks/useTask'

type ListProps = {
  list: ListType
  onPress: () => void
  onLayout?: (event: { nativeEvent: { layout: Layout } }) => void
}

export default function List({list, onPress, onLayout}: ListProps) {
  const {isDarkMode} = useTask()
  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light
  const lineColor = isDarkMode ? theme.colors.grey : theme.colors.secondTextColor.dark

  const listContWidth = (Dimensions.get("screen").width - 58) / 2
  //el icono se renderiza con el nombre guardado en list.icon, que es una propiedad de AntDesign, por lo que se castea a ese tipo para usarlo como nombre del icono
  const iconName = list.icon as keyof typeof AntDesign.glyphMap

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
      onLayout={onLayout}
    >
      <View style={styles.row}>
        <AntDesign style={{transform: [{translateY: -2}]}} name={iconName} size={24} color={list.color} />
        
        <Text style={[styles.lengthText, {color: textColor}]}>{list.tasks.length}</Text>
      </View>

      <Text 
        style={[styles.title, {color: textColor}]}
        numberOfLines={1} 
        ellipsizeMode="clip"
      >{list.title}</Text>
      
      <View style={[styles.line, {backgroundColor: lineColor}]}/>
      
      {list.tasks.slice(0, 3).map((task) => (
        <View key={task.id} style={styles.taskBox}>
          <View style={[styles.checkCircle, {borderColor: lineColor}]}/>
          
          <Text 
            style={[styles.taskText, {color: lineColor}]}
            numberOfLines={1} 
            ellipsizeMode="clip"
          >{task.content}</Text>
        </View>
      ))}
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
    elevation: 12,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  lengthText: {
    fontSize: 26,
    lineHeight: 26,
    fontWeight: "bold",
    textAlignVertical: "center"
  },
  title: {    
    fontSize: 20,
    fontWeight: "500",
    marginTop: 8
  },
  line: {
    height: 0.5, 
    width: "100%",
    marginTop: 12,
  },
  taskBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  taskText: {
    fontSize: 18,
    lineHeight: 18
  }
})