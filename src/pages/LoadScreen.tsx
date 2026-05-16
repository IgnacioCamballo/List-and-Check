import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import useTask from '../hooks/useTask'
import type { RootStackParamList } from '../navigation/types'

export default function LoadScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {setIsDarkMode, setLenguage, setLists} = useTask()

  const getStoragedInfo = async () => {
    const res = await AsyncStorage.getItem("appInfoStorage")
    if (res) {
      const appInfo = JSON.parse(res)
      setLenguage(appInfo.lenguage)
      setIsDarkMode(appInfo.isDarkMode)
      setLists(appInfo.lists)
    }
  }
  
  useEffect(() => {
    getStoragedInfo()

    const timeoutId = setTimeout(() => {
      navigation.replace('Main')
    }, 1000)

    return () => clearTimeout(timeoutId)
    
  }, [navigation])

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#7c4a4a"}}>
      <Text>Cargando</Text>
    </View>
  )
}
