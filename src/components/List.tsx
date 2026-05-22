import React, { useRef } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import theme from '../theme/theme'
import { Layout, ListType } from '../types'
import useTask from '../hooks/useTask'

type ListProps = {
  list: ListType
  onPress?: (layout: Layout, listId: number) => void
  isShell: boolean 
}

export default function List({list, onPress, isShell}: ListProps) {
  const {isDarkMode} = useTask()
  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light
  const lineColor = isDarkMode ? theme.colors.grey : theme.colors.secondTextColor.dark
  const cardRef = useRef<View>(null)

  const listContWidth = (Dimensions.get("screen").width - 58) / 2
  //el icono se renderiza con el nombre guardado en list.icon, que es una propiedad de AntDesign, por lo que se castea a ese tipo para usarlo como nombre del icono
  const iconName = list.icon as keyof typeof AntDesign.glyphMap

  return (
    <View
      ref={cardRef}
      collapsable={false}
      style={[
        styles.listContainer, {
          backgroundColor: isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.secondBaseColor.light,
          //si es shell oculto el shadow y saco el width fijo para la animacion
          minWidth: isShell ? "auto" : listContWidth,
          maxWidth: isShell ? "auto" : listContWidth,
          shadowOffset: isShell ? { width: 0, height: 0 } : { width: 4, height: 4 },
          shadowColor: theme.colors.black,
          shadowOpacity: isShell ? 0 : 0.8,
          shadowRadius: isShell ? 0 : 4,
          elevation: isShell ? 0 : 12
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85} 
        onPress={() => {
          cardRef.current?.measureInWindow((x, y, width, height) => {
            onPress?.({ width, height, x, y }, list.id)
          })
        }}
        style={styles.touchableContent}
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
    </View>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 24,
    height: 160,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  touchableContent: {
    flex: 1
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