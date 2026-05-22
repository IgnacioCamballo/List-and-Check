import React, { useRef, useState } from 'react'
import { Animated, Modal, Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'

import useTask from '../../hooks/useTask'
import theme from '../../theme/theme'
import { Layout, ListType } from '../../types'

import ColorPickerModal from './ColorPickerModal'
import { translate } from '../../utils'
import { AntDesign, Octicons } from '@expo/vector-icons'

type ListModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>,
  list?: ListType
}

type AntDesignName = React.ComponentProps<typeof AntDesign>

export default function ListModal({ setModal, list }: ListModalProps) {
  const { isDarkMode, lenguage, lists, setLists } = useTask()
  const { width: windowWidth } = useWindowDimensions()

  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light
  const secondTextColor = isDarkMode ? theme.colors.secondTextColor.dark : theme.colors.secondTextColor.light
  const modalBackgroundColor = isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.secondBaseColor.light
  const modalSecondColor = isDarkMode ? theme.colors.sectionColor.dark : theme.colors.sectionColor.light
  const itemBgColor = isDarkMode ? theme.colors.black : theme.colors.lightGrey

  //asi evito llamar useTask en utils y translate puede ser usado dentro de funciones
  function translateFn(text: string) {
    return translate({ text, lenguage })
  }

  // genera un color al azara para cuando se crea una lista nueva.
  const getRandomColor = () => {
    const randomValue = Math.floor(Math.random() * 0xffffff)
    return `#${randomValue.toString(16).padStart(6, '0')}`
  }

  const [pickerModal, setPickerModal] = useState(false)
  const [title, setTitle] = useState(list ? list.title : "")
  const [color, setColor] = useState(list ? list.color : getRandomColor())
  const [icon, setIcon] = useState<AntDesignName['name']>(list ? (list.icon as AntDesignName['name']) : "unordered-list")
  const iconScale = useRef(new Animated.Value(1)).current
  const indicatorX = useRef(new Animated.Value(0)).current
  const indicatorY = useRef(new Animated.Value(0)).current
  //al renderizar el componente iconLayouts guarda las posiciones y tamaño de cada icono, para luego animar el indicador a la posición del icono seleccionado
  const [iconLayouts, setIconLayouts] = useState<Partial<Record<AntDesignName['name'], Layout>>>({})

  const iconCellSize = Math.max(40, Math.floor((windowWidth - 102) / 6))
  const iconSize = Math.max(18, Math.round(iconCellSize * 0.55))

  const icons: AntDesignName['name'][] = ["unordered-list", "shopping-cart", "shop", "home", "car", "mobile", "coffee", "contacts", "tool", "dollar", "star", "sun", "heart", "bank", "bar-chart", "book", "bulb", "compass", "control", "credit-card", "dashboard", "edit", "environment", "experiment", "instagram", "laptop", "team", "tags", "rest", "read"]

  const handleChangeIcon = (nextIcon: AntDesignName['name']) => {
    if (nextIcon === icon) return

    //en iconLayouts se guardaron las posiciones de todos los iconos, se busca la del icono especifico seleccionado
    //nextIcon y se utiliza para especificar a donde se dirije la animacion del circulo indicador
    const nextLayout = iconLayouts[nextIcon]
    if (nextLayout) {
      Animated.parallel([
        Animated.timing(indicatorX, {
          toValue: nextLayout.x,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorY, {
          toValue: nextLayout.y,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start()
    }

    Animated.timing(iconScale, {
      toValue: 0.6,
      duration: 110,
      useNativeDriver: true,
    }).start(() => {
      setIcon(nextIcon)
      iconScale.setValue(0.6)

      Animated.timing(iconScale, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start()
    })
  }

  const handleCreateList = () => {
    const newLists = [...lists]
    newLists.push({
      id: Date.now(),
      color: color,
      icon: icon,
      orderNumber: lists.length + 1,
      title,
      tasks: [],
      tasksDone: [],
      showTasksDone: true
    })
    setLists(newLists)
    setModal(false)
  }

  const handleEditList = () => {
    const newLists = lists.map(listInfo => {
      if (listInfo.id === list!.id) {
        return {
          ...listInfo,
          color,
          icon,
          title
        }
      }
      return listInfo
    })
    setLists(newLists)
    setModal(false)
  }

  return (
    <Modal
      onRequestClose={() => setModal(false)}
      visible={true}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalBg} />

      <View 
        style={[
          styles.modalContainer,
          {backgroundColor: modalBackgroundColor}
        ]}
      >
        <View style={styles.rowBetween}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.closeBtn,
              {
                backgroundColor: isDarkMode ? theme.colors.listColor.dark : theme.colors.white,
              }
            ]}
            onPress={() => setModal(false)}
            >
            <AntDesign name="close" size={24} color={isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light} />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <AntDesign name={icon} size={44} color={color}/>
          </Animated.View>

          <TouchableOpacity
            activeOpacity={1}
            disabled={title.trim() === ""}
            style={[
              styles.closeBtn,
              {
                backgroundColor: isDarkMode 
                  ? title.trim() === "" ? theme.colors.listColor.dark : theme.colors.greenSuccess.dark
                  : title.trim() === "" ? theme.colors.listColor.light : theme.colors.greenSuccess.light,
              }
            ]}
            onPress={() => list ? handleEditList() : handleCreateList()}
          >
            <Octicons name="check" size={28} color={isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.modalTitleText, { color: textColor }]}>{translateFn(list ? "editList" : "createList")}</Text>
        
        <TextInput
          style={[styles.modalTextInput, { color: textColor, backgroundColor: modalSecondColor }]}
          value={title}
          onChangeText={setTitle}
        />

        <View style={[styles.colorContainer, { backgroundColor: modalSecondColor }]}>
          <Text style={[styles.modalText, { color: textColor }]}>{translateFn("selectColor")}</Text>
          <TouchableOpacity 
            style={[styles.color, { backgroundColor: color }]}
            activeOpacity={0.7}
            onPress={() => setPickerModal(true)}
          />
        </View>
      
        <View style={[styles.itemContainer, { backgroundColor: modalSecondColor }]}>
          <Text style={[styles.modalText, { color: textColor }]}>{translateFn("icon")}</Text>
          <View style={[styles.line, {borderColor: secondTextColor}]}/>
          <View style={styles.itemsBox}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.iconIndicator,
                {
                  width: iconCellSize,
                  height: iconCellSize,
                  borderRadius: iconCellSize / 2,
                  backgroundColor: itemBgColor,
                  transform: [
                    { translateX: indicatorX },
                    { translateY: indicatorY },
                  ],
                }
              ]}
            />
            {icons.map((iconKey) => (
              <TouchableOpacity
                key={iconKey}
                style={[
                  styles.icon,
                  {
                    width: iconCellSize,
                    height: iconCellSize,
                  }
                ]}
                activeOpacity={1}
                onLayout={(event) => {
                  //toma los valores de posicion y tamaño al renderizar
                  const layout = event.nativeEvent.layout
                  //crea un objeto con esos valores para el icono especifico
                  const nextLayout: Layout = {
                    x: layout.x,
                    y: layout.y,
                    width: layout.width,
                    height: layout.height,
                  }
                  //guarda ese objeto en iconLayouts usando el nombre del icono como clave
                  setIconLayouts((previousLayouts) => {
                    const updatedLayouts = {
                      ...previousLayouts,
                      [iconKey]: nextLayout,
                    }
                    //si el icono de esta iteracion es el mismo que el icono seleccionado actualmente y no tiene una posicion guardada en iconLayouts, se posiciona el indicador en esa posicion
                    if (iconKey === icon && previousLayouts[iconKey] == null) {
                      indicatorX.setValue(nextLayout.x)
                      indicatorY.setValue(nextLayout.y)
                    }

                    return updatedLayouts
                  })
                }}
                onPress={() => handleChangeIcon(iconKey)}
              >
                <AntDesign name={iconKey} size={iconSize} color={secondTextColor} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {pickerModal && <ColorPickerModal currentColor={color} setColor={setColor} setModal={setPickerModal} />}
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 40,
    padding: 20,
    position: "relative"
  },
  modalBg: {
    flex: 1,
    backgroundColor: "#00000056",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: theme.bannerHeight,
  },
  rowBetween: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 20,
  },
  closeBtn: {
    alignSelf: "flex-start",
    width: 48,
    height: 48,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitleText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 48
  },
  modalText: {
    fontSize: theme.fontSizes.F20,
    lineHeight: Platform.OS === "ios" ? 28 : 24,
  },
  modalTextInput: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    marginTop: 20,
    fontSize: 24,
    lineHeight: Platform.OS === "ios" ? 28 : 24,
  },
  colorContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    gap: 12,
    marginTop: 32,
    width: "100%",
    borderRadius: 28,
    paddingHorizontal: 20,
  },
  color: {
    width: 48,
    height: 32,
    borderRadius: 16,
    borderColor: theme.colors.grey,
    borderWidth: 1,
  },
  boton: {
    width: "100%",
    marginTop: 20,
    marginBottom: 12,
    backgroundColor: theme.colors.lightGrey,
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 8,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: theme.colors.black,
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: Platform.OS === "android" ? 1 : 0,
  },
  botonText: {
    fontSize: theme.fontSizes.F20
  },
  itemContainer: {
    marginTop: 32,
    width: "100%",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 80
  },
  line: {
    height: 1, 
    borderWidth:0.5, 
    width: "100%",
    marginBlock: 8
  },
  itemsBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4
  },
  iconIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%"
  }
})


