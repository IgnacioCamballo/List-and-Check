import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ColorPicker, { HueSlider, Panel1, Preview } from 'reanimated-color-picker'
import Modal from './basic/Modal'

type ColorPickerModalProps = {
  currentColor?: string,
  setColor: React.Dispatch<React.SetStateAction<string>>,
  setModal: React.Dispatch<React.SetStateAction<boolean>>,
  }

export default function ColorPickerModal({currentColor, setColor, setModal} : ColorPickerModalProps) {
  // genera un color al azara para cuando se crea una lista nueva.
  const getRandomColor = () => {
    const randomValue = Math.floor(Math.random() * 0xffffff)
    return `#${randomValue.toString(16).padStart(6, '0')}`
  }

  const initialColor = currentColor ?? getRandomColor()

  const [tempColor, setTempColor] = useState(initialColor)

  const handleColorChange = (color: { hex: string }) => {
    const hexColor = color.hex
    setTempColor(hexColor)
  }

  return (
    <Modal>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <ColorPicker 
            style={styles.colorPicker} 
            value={tempColor} 
            onComplete={color => handleColorChange(color)}
          >
            <Preview hideText={true} hideInitialColor={true}/>
            <Panel1 />
            <HueSlider />
          </ColorPicker>

          <View style={styles.botones}>
            <TouchableOpacity 
              style={styles.boton} 
              activeOpacity={0.7}
              onPress={() => {setModal(false)}}
            >
              <Text style={styles.botonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.boton} 
              activeOpacity={0.7}
              onPress={() => {setModal(false), setColor(tempColor)}}
            >
              <Text style={styles.botonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '90%'
  },
  colorPicker: {
    width: '100%',
    height: 260
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 18
  },
  botonText: {
    fontSize: 16,
    fontWeight: '600'
  }
})
