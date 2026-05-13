import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Modal from './basic/Modal'

type ConfigModalProps = {
  isVisible: boolean,
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConfigModal({ isVisible, setIsVisible }: ConfigModalProps) {



  if (isVisible) return (
    <Modal>
      <Text>ConfigModal</Text>
    </Modal>
  )
}

const styles = StyleSheet.create({
  
})
