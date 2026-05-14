import React, { useState } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import useTask from '../../hooks/useTask'
import theme from '../../theme/theme'

import ColorPickerModal from './ColorPickerModal'
import { translate } from '../../utils'
import { AntDesign, Octicons } from '@expo/vector-icons'

type NewListModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function NewListModal({ setModal }: NewListModalProps) {
  const { isDarkMode, lenguage, lists, setLists } = useTask()
  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light

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
  const [title, setTitle] = useState("")
  const [color, setColor] = useState(getRandomColor())

  const handleCreateList = () => {
    const newLists = [...lists]
    newLists.push({
      id: Date.now(),
      borderColor: color,
      orderNumber: lists.length + 1,
      title,
      tasks: [],
      tasksDone: []
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
          {backgroundColor: isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.secondBaseColor.light}
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
            onPress={() => handleCreateList()}
          >
            <Octicons name="check" size={28} color={isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.modalTitleText, { color: textColor }]}>{translateFn("createList")}</Text>
        
        <TextInput
          style={[styles.modalTextInput, { color: textColor, borderColor: textColor }]}
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity
          style={styles.colorContainer}
          activeOpacity={0.7}
          onPress={() => setPickerModal(true)}
        >
          <View style={[styles.color, { backgroundColor: color }]} />
          <Text style={[styles.modalText, { color: textColor }]}>{translateFn("selectColor")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          activeOpacity={0.7}
          onPress={() => handleCreateList()}
        >
          <Text style={styles.botonText}>{translateFn("createList")}</Text>
        </TouchableOpacity>
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
    padding: 20
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
    alignItems: "center"
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
    fontSize: theme.fontSizes.F22,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: theme.fontSizes.F20,
    fontWeight: 'bold'
  },
  modalTextInput: {
    width: "100%",
    height: 40,
    borderColor: theme.colors.black,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 12,
    fontSize: theme.fontSizes.F18,
    lineHeight: Platform.OS === "ios" ? theme.fontSizes.F20 : theme.fontSizes.F18,
  },
  colorContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20
  },
  color: {
    width: 52,
    height: 28,
    borderColor: theme.colors.black,
    borderWidth: 1
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
})


