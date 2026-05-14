import React, { useState } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ColorPicker, { ColorFormatsObject, HueSlider, Panel1, Preview } from 'reanimated-color-picker'

import theme from '../../theme/theme';
import useTask from '../../hooks/useTask';

export interface returnedResults {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  hsv: string;
  hsva: string;
  hwb: string;
  hwba: string;
}

type ColorPickerModalProps = {
  currentColor: string,
  setColor: React.Dispatch<React.SetStateAction<string>>,
  setModal: React.Dispatch<React.SetStateAction<boolean>>,
  }

export default function ColorPickerModal({currentColor, setColor, setModal} : ColorPickerModalProps) {
  const {isDarkMode} = useTask()

  const [tempColor, setTempColor] = useState(currentColor)

  const handleColorChange = (color: ColorFormatsObject) => {
    const hexColor = color.hex
    setTempColor(hexColor)
  }

  return (
      <View 
        style={[
          styles.modalContainer, 
          {backgroundColor: isDarkMode ? theme.colors.baseColor.dark : theme.colors.white}
        ]}
      >
        <ColorPicker 
          style={styles.colorPicker} 
          value={tempColor} 
          onCompleteJS={color => handleColorChange(color)}
        >
          <Preview hideText={true} hideInitialColor={true}/>
          <Panel1 />
          <HueSlider />
        </ColorPicker>

        <View style={styles.botones}>
          <TouchableOpacity 
            style={styles.boton} 
            activeOpacity={0.7}
            onPress={() => setModal(false)}
          >
            <Text style={styles.botonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton} 
            activeOpacity={0.7}
            onPress={() => {setModal(false); setColor(tempColor);}}
          >
            <Text style={styles.botonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: 400,
    borderRadius: 20,
    padding: 20
  },
  colorPicker: {
    width: '100%',
    gap: 20
  },
  botones: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  boton: {
    backgroundColor: theme.colors.lightGrey,
    alignItems: "center",
    width: 100,
    paddingVertical: 4,
    borderRadius: 8,
    shadowOffset: {width: 2, height: 2},
    shadowColor: theme.colors.black,
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 10,
    borderColor:theme.colors.lightGrey, 
    borderWidth: Platform.OS === "android" ? 1 : 0,
  },
  botonText: {
    fontSize: theme.fontSizes.F20
  },
  textAlert: {
    fontSize: theme.fontSizes.F18,
    fontWeight: "500",
    textTransform: "uppercase",
    color: theme.colors.red,
    backgroundColor: theme.colors.lightRed,
    margin: 32,
    height: 40,
    textAlign: "center",
    textAlignVertical: "center"
  },
  textoBoton: {
    fontSize: theme.fontSizes.F18,
    fontWeight: "500"    
  }, textBotonChico: {
    fontSize: theme.fontSizes.F20,
    fontWeight: "500",
    lineHeight: theme.fontSizes.F20
  }
})
