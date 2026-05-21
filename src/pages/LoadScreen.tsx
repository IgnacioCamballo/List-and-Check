import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types'

import useTask from '../hooks/useTask'

export default function LoadScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {setIsDarkMode, setLenguage, setLists} = useTask()

  const iconScale = useRef(new Animated.Value(0)).current
  const iconOpacity = useRef(new Animated.Value(0)).current

  const getStoragedInfo = async () => {
    const res = await AsyncStorage.getItem("appInfoStorage")
    if (res) {
      const appInfo = JSON.parse(res)
      setLenguage(appInfo.lenguage)
      setIsDarkMode(appInfo.isDarkMode)
      setLists(appInfo.lists)
    }
  }

  const startIntroAnimation = () => {
    return new Promise<void>((resolve) => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(iconScale, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(iconOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        ]),
        Animated.spring(iconScale, {
          toValue: 1,
          velocity: 2.8,
          tension: 40,
          friction: 5.8,
          useNativeDriver: true,
        })
      ]).start(() => resolve())
    })
  }
  
  useEffect(() => {
    const initializeApp = async () => {
      const promises = await Promise.all([getStoragedInfo(), startIntroAnimation()])
      if(promises) {
        navigation.replace('Main')
      }
    }

    initializeApp()
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: iconScale }],
            opacity: iconOpacity
          }
        ]}  
      >
        <Image
          source={require('../../assets/icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.7,
  }
})
