import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import useTask from '../../hooks/useTask'
import theme from '../../theme/theme'
import { translate } from '../../utils'

type AddTaskModalProps = {
  closeModal: () => void,
  listId: number
}

export default function AddTaskModal({ closeModal, listId } : AddTaskModalProps) {
  const { isDarkMode, lists, setLists, lenguage } = useTask()
  const [taskContent, setTaskContent] = useState('')
  const inputRef = useRef<TextInput>(null)

  const currentList = lists.find(list => list.id === listId)

  //asi evito llamar useTask en utils y translate puede ser usado dentro de funciones
  function translateFn(text: string) {
    return translate({ text, lenguage })
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addTaskToList = () => {
    if (taskContent.trim() === '') return
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: [...list.tasks, { id: Date.now(), content: taskContent, orderNumber: list.tasks.length + 1}]
        }
      }
      return list
    })
    setLists(updatedLists)
    setTaskContent('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleCloseModal = () => {
    addTaskToList()
    closeModal()
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={closeModal}>
      <Pressable style={styles.backdrop} onPress={closeModal} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
      >
        <View style={[
          styles.modalContainer,
          { backgroundColor: isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.secondBaseColor.light }
        ]}>
          <View style={styles.row}>
            <Text 
              style={[
                styles.title, 
                { color: isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light }
              ]}
            >{translateFn('addTask')}</Text>

            
            <TouchableOpacity
              style={styles.closeButtonContainer}
              onPress={() => handleCloseModal()}
              activeOpacity={1}
            >
              <View style={[
                styles.closeButton, 
                {backgroundColor: currentList?.color, opacity: 0.2}
              ]}/>
              <Text 
                style={[
                  styles.closeText,
                  {color: currentList?.color, opacity: 1}
                ]}
              >{translateFn('done')}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            ref={inputRef}
            autoFocus
            blurOnSubmit={false}
            returnKeyType="done"
            value={taskContent}
            onChangeText={setTaskContent}
            onSubmitEditing={addTaskToList}
            placeholder={translateFn('task')}
            placeholderTextColor={isDarkMode ? theme.colors.secondTextColor.dark : theme.colors.secondTextColor.light}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? theme.colors.sectionColor.dark : theme.colors.white,
                color: isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light,
                borderColor: isDarkMode ? theme.colors.listColor.dark : theme.colors.listColor.light,
              }
            ]}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000031',
  },
  keyboardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 28,
    padding: 20
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlignVertical: 'center'
  },
  input: {
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlignVertical: 'center',
    justifyContent: 'space-between'
  },
  closeButtonContainer: {
    width: 80,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    transform: [{ translateY: -6 }],
  },
  closeButton: {
    flex: 1
  },
  closeText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '600',
  },
})
