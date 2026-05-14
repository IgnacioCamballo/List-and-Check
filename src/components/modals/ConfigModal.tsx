import React, { useRef } from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Animated } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import {FontAwesome6, Fontisto} from '@expo/vector-icons';


import useTask from '../../hooks/useTask'
import theme from '../../theme/theme'
import { translate } from '../../utils'

import SliderTheme from '../basic/sliders/SliderTheme'

type ConfigModalProps = {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConfigModal({ setIsVisible }: ConfigModalProps) {
  const { isDarkMode, setIsDarkMode, lenguage, setLenguage } = useTask()

  //referencia para la animación
  const bgColorStylesValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current

  //asi evito llamar useTask en utils y translate puede ser usado dentro de funciones
  function translateFn(text: string) {
    return translate({ text, lenguage })
  }

  //parametros de la animación
  const secondBaseColorStyles = {
    backgroundColor: bgColorStylesValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.secondBaseColor.light, theme.colors.secondBaseColor.dark]
    })
  }

  //lanzador de la animación
  const handleThemeChange = () => {
    Animated.parallel([
      Animated.timing(bgColorStylesValue, {
        toValue: isDarkMode ? 0 : 1,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
    setIsDarkMode(!isDarkMode);
  }

  return (
    <Modal
      onRequestClose={() => setIsVisible(false)}
      visible={true}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalBg} />
      <Animated.View style={[
        styles.modalContainer,
        secondBaseColorStyles
      ]}>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.closeBtn,
            {
              backgroundColor: isDarkMode ? theme.colors.listColor.dark : theme.colors.white,
            }
          ]}
          onPress={() => setIsVisible(false)}
        >
          <AntDesign name="close" size={24} color={isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light} />
        </TouchableOpacity>
        <Text
          style={[
            styles.modalTitleText,
            { color: isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light }
          ]}
        >{translateFn("config")}</Text>

        <View style={[styles.configContainer, { backgroundColor: isDarkMode ? theme.colors.sectionColor.dark : theme.colors.sectionColor.light }]}>
          <View style={styles.selectorContainer}>
            <View style={styles.rowCont}>
              <FontAwesome6
                name="circle-half-stroke"
                size={24}
                color={isDarkMode ? theme.colors.secondTextColor.dark : theme.colors.secondTextColor.light}
              />
              <Text
                style={[
                  styles.selectorText,
                  { color: isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light }
                ]}
              >{translateFn("theme")}</Text>
            </View>

            <SliderTheme value={isDarkMode} setValue={handleThemeChange} />
          </View>

          <View style={styles.selectorContainer}>
            <View style={styles.rowCont}>
              <Fontisto
                name="world-o"
                size={24}
                color={isDarkMode ? theme.colors.secondTextColor.dark : theme.colors.secondTextColor.light}
              />
              <Text
                style={[
                  styles.selectorText,
                  { color: isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light }
                ]}
              >{translateFn("lenguage")}</Text>
            </View>

            <TouchableOpacity 
              activeOpacity={1}
              onPress={() => setLenguage(lenguage === "es" ? "en" : "es")}
              style={styles.rowCont}
            >
              <Text
                style={[
                  styles.selectorText,
                  { color: isDarkMode ? theme.colors.secondTextColor.dark : theme.colors.secondTextColor.light }
                ]}
              >
                {lenguage === "es" ? "Español" : "English"}
              </Text>
              <FontAwesome6
                style={{transform: [{translateY: 2}]}}
                name="arrows-rotate"
                size={14}
                color={isDarkMode ? theme.colors.secondTextColor.dark : theme.colors.secondTextColor.light}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
  selectorContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitleText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  configContainer: {
    width: "100%",
    gap: 20,
    marginTop: 12,
    padding: 20,
    borderRadius: 36
  },
  selectorText: {
    fontSize: theme.fontSizes.F22,
  },
  closeBtn: {
    alignSelf: "flex-start",
    width: 48,
    height: 48,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  rowCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  }
})
