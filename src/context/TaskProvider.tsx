import { createContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MobileAds } from 'react-native-google-mobile-ads';

import { ConfigInfo, ListType, TaskContextProps } from "../types"
import theme from "../theme/theme"

interface props {
  children: React.ReactNode
}

const TaskContext = createContext<TaskContextProps>({} as TaskContextProps)

const TaskProvider = ({ children }: props) => {
  const colorScheme = useColorScheme()

  const initialCofigInfo = {
    baseColor: colorScheme === "dark" ? theme.colors.baseColor.dark : theme.colors.baseColor.light,
    buttonsColor: colorScheme === "dark" ? theme.colors.listColor.dark : theme.colors.white,
    textColor: colorScheme === "dark" ? theme.colors.textColor.dark : theme.colors.textColor.light,
  }
  
  const [configInfo, setConfigInfo] = useState<ConfigInfo>(initialCofigInfo)
  const [lenguage, setLenguage] = useState("es")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(colorScheme === "dark" ? true : false)
  const [lists, setLists] = useState<ListType[]>([])
  const [addsInitialized, setAddsInitialized] = useState(false)
  const [runAnimationAfterList, setRunAnimationAfterList] = useState(false)
  
  useEffect(() => {
    const appInfo = {lenguage, isDarkMode, lists}
    AsyncStorage.setItem("appInfoStorage", JSON.stringify(appInfo))
  }, [lenguage, isDarkMode, lists])

  //Initializes adds
  const addsInit = async () => {
    try {
      await MobileAds().initialize()
      setAddsInitialized(true)
    } catch (error) {
      console.log(error)
    }
  }   

  useEffect(() => {
    addsInit()
  }, [])

  return (
    <TaskContext.Provider 
      value={{
        configInfo,
        lenguage,
        isDarkMode,
        lists,
        addsInitialized,
        runAnimationAfterList,
        setConfigInfo,
        setLenguage,
        setIsDarkMode,
        setLists,
        setRunAnimationAfterList
      }}>
      {children}
    </TaskContext.Provider>
  )
}

export {TaskProvider}

export default TaskContext