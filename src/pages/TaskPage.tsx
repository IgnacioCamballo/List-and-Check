import React, { useEffect, useRef, useState } from 'react'
import { Alert, Animated, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import type { RootStackParamList } from '../types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { LinearGradient } from 'expo-linear-gradient'

import useTask from '../hooks/useTask'
import theme from '../theme/theme'
import { translate } from '../utils'

import ListModal from '../components/modals/ListModal'
import AddTaskModal from '../components/modals/AddTaskModal'
import EditTaskModal from '../components/modals/EditTaskModal'

export default function TaskPage() {
  const route = useRoute<RouteProp<RootStackParamList, 'TaskPage'>>()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { lists, setLists, isDarkMode, lenguage, setRunAnimationAfterList } = useTask()
  //referencia para la animacion de salida si el usuario vuelve con deslizar en la pantalla en lugar del boton
  const allowNativeGoBackRef = useRef(false)

  //asi evito llamar useTask en utils y translate puede ser usado dentro de funciones
  function translateFn(text: string) {
    return translate({ text, lenguage })
  }

  const selectedList = lists.find((list) => list.id === route.params.listId)

  //si no hay lista muestra mensaje de error
  if (!selectedList) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.baseColor.light, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: theme.colors.textColor.light }}>{translateFn("listNotFound")}</Text>
      </View>
    )
  }

  const [editModal, setEditModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [movingTask, setMovingTask] = useState<number>(0) // id de la tarea que se esta moviendo, se usa para animar entrada y salida de las listas

  const bgColor = isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.baseColor.light
  const bgColorWithOpacity = isDarkMode ? theme.colors.secondBaseColor.transparentDark : theme.colors.baseColor.transparentLight
  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light
  const secondTextColor = isDarkMode ? theme.colors.tirthTextColor.dark : theme.colors.tirthTextColor.light
  const buttonColor = isDarkMode ? theme.colors.listColor.dark : theme.colors.white

  //el icono se renderiza con el nombre guardado en list.icon, que es una propiedad de AntDesign, por lo que se castea a ese tipo para usarlo como nombre del icono
  const iconName = selectedList?.icon as keyof typeof AntDesign.glyphMap

  //valores de animaciones
  const opacityValue = useRef(new Animated.Value(1)).current
  const StartingOpacityValue = useRef(new Animated.Value(0)).current //opacidad para la aniacion al abrir la lista
  const opacityValueTasksDone = useRef(new Animated.Value(selectedList.showTasksDone ? 1 : 0)).current
  const opacityMovingTask = useRef(new Animated.Value(1)).current
  //utilizo los siguientes 3 para animar el mover tareas de hechas a no hechas y viceversa
  //altura total medida de la lista de tareas sin hacer
  const [measuredTasksHeight, setMeasuredTasksHeight] = useState(0)
  const tasksHeight = useRef(new Animated.Value(0)).current
  const taskHeightsRef = useRef<Record<number, number>>({})

  useEffect(() => {
    Animated.timing(StartingOpacityValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false
    }).start()
  }, [])

  const handleHideTasksDone = () => {
    const newListInfo = {
      ...selectedList,
      showTasksDone: !selectedList.showTasksDone
    }
    const newLists = lists.map(list => list.id === selectedList.id ? newListInfo : list)

    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      setLists(newLists)
      opacityValue.setValue(0)
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start()
    })

    Animated.timing(opacityValueTasksDone, {
      toValue: selectedList.showTasksDone ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const moveTaskToDone = (taskId: number) => {
    const taskInfo = selectedList.tasks.find(task => task.id === taskId)
    const newListInfo = {
      ...selectedList,
      tasks: [...selectedList.tasks.filter(task => task.id !== taskId)],
      tasksDone: [...selectedList.tasksDone, taskInfo!]
    }
    const newLists = lists.map(list => list.id === selectedList.id ? newListInfo : list)

    setMovingTask(taskId)
    Animated.timing(opacityMovingTask, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start(() => {
      setLists(newLists)
      opacityMovingTask.setValue(0)
      Animated.parallel([
        Animated.timing(tasksHeight, {
          toValue: measuredTasksHeight - (taskHeightsRef.current[taskId] ?? 0),
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityMovingTask, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false
        })
      ]).start(() => { setMovingTask(0), setMeasuredTasksHeight(measuredTasksHeight - (taskHeightsRef.current[taskId] ?? 0)) })
    })
  }

  const moveTaskToNotDone = (taskId: number) => {
    const taskInfo = selectedList.tasksDone.find(task => task.id === taskId)
    const newListInfo = {
      ...selectedList,
      tasks: [...selectedList.tasks, taskInfo!],
      tasksDone: [...selectedList.tasksDone.filter(task => task.id !== taskId)]
    }
    const newLists = lists.map(list => list.id === selectedList.id ? newListInfo : list)

    setMovingTask(taskId)
    Animated.timing(opacityMovingTask, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start(() => {
      setLists(newLists)
      opacityMovingTask.setValue(0)
      Animated.parallel([
        Animated.timing(tasksHeight, {
          toValue: measuredTasksHeight + (taskHeightsRef.current[taskId] ?? 0),
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityMovingTask, {
          toValue: 1,
          duration: 350,
          useNativeDriver: false
        })
      ]).start(() => { setMovingTask(0), setMeasuredTasksHeight(measuredTasksHeight + (taskHeightsRef.current[taskId] ?? 0)) })
    })
  }

  //si la altura de la tarea no esta guardada la guarda y recalcula el alto total
  const handleSaveLayoutTask = (taskId: number, height: number) => {
    if (taskHeightsRef.current[taskId] === height) return

    taskHeightsRef.current = {
      ...taskHeightsRef.current,
      [taskId]: height,
    }

    const totalHeight = selectedList.tasks.reduce((accumulator, task) => {
      return accumulator + (taskHeightsRef.current[task.id] ?? 0)
    }, 0)
    setMeasuredTasksHeight(totalHeight)
    tasksHeight.setValue(totalHeight)
  }

  const handleDeleteTasksDone = () => {
    const newListInfo = {
      ...selectedList,
      tasksDone: []
    }
    const newLists = lists.map(list => list.id === selectedList.id ? newListInfo : list)
    setLists(newLists)
  }

  const showDeleteTasksDoneAlert = () => {
    Alert.alert(
      '',
      `${translateFn("tasksDeleteAlert")}?`,
      [
        {
          text: translateFn("cancel"),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => handleDeleteTasksDone(),
          style: 'destructive'
        },
      ],
      {
        cancelable: true
      }
    )
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (allowNativeGoBackRef.current) {
        allowNativeGoBackRef.current = false
        return
      }

      event.preventDefault()

      Animated.timing(StartingOpacityValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false
      }).start(() => {
        setRunAnimationAfterList(true)
        allowNativeGoBackRef.current = true
        navigation.dispatch(event.data.action)
      })
    })

    return unsubscribe
  }, [navigation, setRunAnimationAfterList, StartingOpacityValue])

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Animated.View style={{ flex: 1, opacity: StartingOpacityValue }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {/* Lista de tareas sin hacer */}
          <View
            onLayout={(event) => {
              if (measuredTasksHeight === 0) {
                setMeasuredTasksHeight(event.nativeEvent.layout.height)
              }
            }}
          >
            <Animated.View style={{ height: measuredTasksHeight === 0 ? "auto" : tasksHeight }}>
              {selectedList.tasks.map(task => (
                <Animated.View
                  key={task.id}
                  style={{ opacity: movingTask === task.id ? opacityMovingTask : 1 }}
                  onLayout={(event) => handleSaveLayoutTask(task.id, event.nativeEvent.layout.height)}
                >
                  <View style={styles.taskRow}>
                    <TouchableOpacity activeOpacity={1} onPress={() => moveTaskToDone(task.id)}>
                      <View style={[styles.checkCircle, { borderColor: selectedList.color }]} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1} onPress={() => setEditingTask(task.id)}>
                      <Text style={[styles.taskText, { color: textColor }]}>{task.content}</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          </View>

          {/* Linea separadora */}
          {selectedList.tasksDone.length > 0 && (
            <View style={styles.tasksDivider}>
              <Animated.View style={{ opacity: opacityValue }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{ marginVertical: 8, marginLeft: 2 }}
                  onPress={() => handleHideTasksDone()}
                >
                  <Feather
                    name={selectedList.showTasksDone ? "eye" : "eye-off"}
                    size={20}
                    color={secondTextColor}
                  />
                </TouchableOpacity>
              </Animated.View>
              <View style={[styles.dividerLine, { backgroundColor: secondTextColor }]} />
              <Text style={[styles.sectionTitle, { color: secondTextColor }]}>{translateFn("completed")}</Text>
              <View style={[styles.dividerLine, { backgroundColor: secondTextColor }]} />

              <TouchableOpacity
                activeOpacity={1}
                style={[styles.deleteButton, { borderColor: secondTextColor }]}
                onPress={() => showDeleteTasksDoneAlert()}
              >
                <MaterialIcons name="delete" size={16} color={secondTextColor} />
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de tareas hechas */}
          <Animated.View style={{ opacity: opacityValueTasksDone }}>
            {selectedList.showTasksDone && selectedList.tasksDone.map(task => (
              <Animated.View
                key={task.id}
                style={{ opacity: movingTask === task.id ? opacityMovingTask : 1 }}
              >
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskRow}
                  activeOpacity={1}
                  onPress={() => moveTaskToNotDone(task.id)}
                >
                  <View style={[styles.checkedCircle, { backgroundColor: selectedList.color }]}>
                    <AntDesign name="check" size={14} color={theme.colors.white} />
                  </View>
                  <Text style={[styles.taskText, { color: textColor }]}>{task.content}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.btnAdd, { backgroundColor: buttonColor }]}
          activeOpacity={0.9}
          onPress={() => setAddModal(true)}
        >
          <Feather name="plus" size={32} color={selectedList.color} />
        </TouchableOpacity>

        {editModal && <ListModal setModal={setEditModal} list={selectedList} />}
        {addModal && <AddTaskModal closeModal={() => setAddModal(false)} listId={selectedList.id} />}
        {editingTask !== null && <EditTaskModal closeModal={() => setEditingTask(null)} listId={selectedList.id} taskId={editingTask}/>}

        <View style={styles.buttonContainer} pointerEvents="box-none">
          <LinearGradient
            colors={[bgColor, bgColorWithOpacity]}
            start={{ x: 0, y: 0.8 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: buttonColor }]}
            activeOpacity={0.9}
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color={selectedList.color} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <AntDesign name={iconName} size={28} color={selectedList.color} />
            <Text
              style={[styles.titleText, { color: textColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"

            >{selectedList.title}</Text>
          </View>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: buttonColor }]}
            activeOpacity={0.9}
            onPress={() => setEditModal(true)}
          >
            <Feather name="edit-3" size={24} color={selectedList.color} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingInline: 20,
    paddingBottom: 12,
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
    transform: [{ translateY: -4 }],
    maxWidth: Math.round(Dimensions.get("screen").width - 180)
  },
  titleText: {
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
  checkedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  taskText: {
    fontSize: 18,
    lineHeight: 20,
    width: Math.round(Dimensions.get("screen").width - 80)
  },
  tasksDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
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
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  btnAdd: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    zIndex: 20,
    elevation: 20,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 120 : 96,
    paddingBottom: 96,
  }
})
