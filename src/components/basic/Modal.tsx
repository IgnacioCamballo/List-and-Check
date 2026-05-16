import React from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle, Modal } from 'react-native'
import theme from '../../theme/theme'
import useTask from '../../hooks/useTask'

type ModalProps = {
  children: React.ReactNode,
  closeModal: () => void,
  innerStyles?: StyleProp<ViewStyle>
  bgStyles?: StyleProp<ViewStyle>
}

export default function ModalBase({ children, closeModal, innerStyles, bgStyles }: ModalProps) {
  const {isDarkMode} = useTask()

  return (
    <Modal 
      onRequestClose={closeModal} 
      visible={true} 
      transparent={true} 
      animationType="slide"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeModal}
        style={[
          styles.modalBg, 
          {backgroundColor: isDarkMode ? "#ffffff20" : "#00000056"},
          bgStyles
        ]}
      />
        
      <View 
        style={[
          styles.modalBox,
          {backgroundColor: isDarkMode ? theme.colors.baseColor.dark : theme.colors.white},
          innerStyles
        ]}
        >
        {children}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBg: {
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: theme.bannerHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#00000056"
  },
  modalBox: {
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    width: "80%",
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: "relative"
  },
})
