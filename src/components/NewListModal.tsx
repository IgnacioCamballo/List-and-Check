import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import useTask from '../hooks/useTask'
import theme from '../theme/theme'

import Modal from './basic/Modal'
import ColorPickerModal from './ColorPickerModal'

type NewListModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function NewListModal({ setModal }: NewListModalProps) {
  const {isDarkMode} = useTask()

  const [pickerModal, setPickerModal] = useState(false)
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("")

  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light

  return (
    <Modal>
      <Text style= {[styles.modalTitleText, {color: textColor}]}>Title / Titulo</Text>
      <TextInput
        style={[styles.modalTextInput, {color: textColor, borderColor: textColor}]}
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity onPress={() => setPickerModal(true)} style={[styles.color, {backgroundColor: color}]}/>

    {!pickerModal && <ColorPickerModal currentColor={color} setColor={setColor} setModal={setPickerModal} />}
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalTextInput: {
    width: "100%",
    height: 40,
    borderColor: theme.colors.black,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  color: {
    width: 20,
    height: 20,
    position: "relative",
    top: 4,
    left: 8
  }
})


