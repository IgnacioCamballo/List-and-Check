import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import theme from '../../theme/theme'
import useTask from '../../hooks/useTask'

type ModalProps = {
  children: React.ReactNode
}

export default function Modal({ children } : ModalProps) {
  const {isDarkMode} = useTask()

  return (
    <View 
      style={[
        styles.generalContainer, 
        {backgroundColor: isDarkMode ? "#ffffff20" : "#00000056"}
      ]}
    >
      <View 
        style={[
          styles.modalBox,
          {backgroundColor: isDarkMode ? theme.colors.baseColor.dark : theme.colors.white}
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  generalContainer: {
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#00000056"
  },
  modalBox: {
    width: "80%",
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
})
