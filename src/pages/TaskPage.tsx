import React, { useState } from 'react'
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons'
import type { RootStackParamList } from '../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import useTask from '../hooks/useTask'
import theme from '../theme/theme'
import ListModal from '../components/modals/ListModal'
import { translate } from '../utils'

export default function TaskPage() {
  const route = useRoute<RouteProp<RootStackParamList, 'TaskPage'>>()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { lists, setLists, isDarkMode, lenguage } = useTask()

  //asi evito llamar useTask en utils y translate puede ser usado dentro de funciones
  function translateFn(text: string) {
    return translate({ text, lenguage })
  }

  const [editModal, setEditModal] = useState(false)
  
  const selectedList = lists.find((list) => list.id === route.params.listId)
  //si no hay lista muestra mensaje de error
  if (!selectedList) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.baseColor.light, alignItems: "center", justifyContent: "center"}]}>
        <Text style={{color: theme.colors.textColor.light}}>{translateFn("listNotFound")}</Text>
      </View>
    )
  }

  const bgColor = isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.baseColor.light
  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light
  const secondTextColor = isDarkMode ? theme.colors.tirthTextColor.dark : theme.colors.tirthTextColor.light
  const buttonColor = isDarkMode ? theme.colors.listColor.dark : theme.colors.white

 //el icono se renderiza con el nombre guardado en list.icon, que es una propiedad de AntDesign, por lo que se castea a ese tipo para usarlo como nombre del icono
  const iconName = selectedList?.icon as keyof typeof AntDesign.glyphMap

  const moveTaskToDone = (taskId: number) => {
    const taskInfo = selectedList.tasks.find(task => task.id === taskId)
    const newListInfo = {
      ...selectedList, 
      tasks: [...selectedList.tasks.filter(task => task.id !== taskId)],
      tasksDone: [...selectedList.tasksDone, taskInfo!]
    }
    const newLists = lists.map(list => list.id === selectedList.id ? newListInfo : list)
    setLists(newLists)
  }

  const moveTaskToNotDone = (taskId: number) => {
 const taskInfo = selectedList.tasksDone.find(task => task.id === taskId)
    const newListInfo = {
      ...selectedList, 
      tasks: [...selectedList.tasks, taskInfo!],
      tasksDone: [...selectedList.tasksDone.filter(task => task.id !== taskId)]
    }
    const newLists = lists.map(list => list.id === selectedList.id ? newListInfo : list)
    setLists(newLists)
  }

  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <View style= {styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.btn, {backgroundColor: buttonColor}]}
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
          >
          <Ionicons name="chevron-back" size={24} color={selectedList.color}/> 
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <AntDesign name={iconName} size={28} color={selectedList.color}/>
          <Text 
            style={[styles.titleText, {color: textColor}]}
            numberOfLines={1}
            ellipsizeMode="tail"
          
          >{selectedList.title}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.btn, {backgroundColor: buttonColor}]}
          activeOpacity={0.9}
          onPress={() => setEditModal(true)}
          >
          <Feather name="edit-3" size={24} color={selectedList.color}/>
        </TouchableOpacity>
      </View>

      {/* Lista de tareas sin hacer */}
      {selectedList.tasks.map(task => (
        <TouchableOpacity 
          key={task.id}
          style={styles.taskRow} 
          activeOpacity={1}
          onPress={() => moveTaskToDone(task.id)}
        >
          <View style={[styles.checkCircle, {borderColor: selectedList.color}]}/>
          <Text style={[styles.taskText, {color: textColor}]}>{task.content}</Text>
        </TouchableOpacity>
      ))}

      {/* Linea separadora */}
      {selectedList.tasksDone.length > 0 && (
        <View style={styles.tasksDivider}>
          <Feather 
            name={selectedList.showTasksDone ? "eye" : "eye-off"} 
            size={20} 
            color={secondTextColor} style={{alignSelf: "center", marginVertical: 12}}
          
          />
          <View style={[styles.dividerLine, {backgroundColor: secondTextColor}]}/>
          <Text style={[styles.sectionTitle, {color: secondTextColor}]}>{translateFn("completed")}</Text>
        </View>
      )}

      {/* Lista de tareas hechas */}
      {selectedList.tasksDone.map(task => (
        <TouchableOpacity 
          key={task.id}
          style={styles.taskRow} 
          activeOpacity={1}
          onPress={() => moveTaskToNotDone(task.id)}
        >
          <View style={[styles.checkCircle, {borderColor: selectedList.color}]}/>
          <Text style={[styles.taskText, {color: textColor}]}>{task.content}</Text>
        </TouchableOpacity>
      ))}
      {editModal && <ListModal setModal={setEditModal} list={selectedList}/>}
    </View>
  )
}
        
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingInline: 20,
    marginBottom: 12,
    maxWidth: "100%"
  },
    btn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    marginBottom: 12
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    transform: [{translateY: -4}],
    maxWidth: Math.round(Dimensions.get("screen").width -180)
  },
  titleText : {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "bold",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingBlock: 12
  },
    checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  taskText: {
    fontSize: 18,
    lineHeight: 18
  },
  tasksDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 24
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
     textTransform: "uppercase"
  }
})
