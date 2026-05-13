import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useNavigate } from 'react-router-native'
import useTask from '../hooks/useTask'

export default function LoadScreen() {
  const navigate = useNavigate()
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

    setTimeout(() => {
      navigate("/lists")
    }, 1000);
    
  }, [])

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#7c4a4a"}}>
      <Text>Cargando</Text>
    </View>
  )
}
