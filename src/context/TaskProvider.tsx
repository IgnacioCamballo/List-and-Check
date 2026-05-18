import { createContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
  
  //usado solo para test 
  const testLists = [
    {
      id: 1,
      color: "#d62323",
      icon: "unordered-list",
      orderNumber: 1,
      title: "escuela",
      tasks: [{
        id: 1111,
        orderNumber: 1,
        content: "hacer tarea"
      },
      {
        id: 1112,
        orderNumber: 2,
        content: "hacer la otra"
      }],
      tasksDone: [],
      showTasksDone: true

    },
    {
      id: 2,
      color: "#d6d623",
      icon: "unordered-list",
      orderNumber: 2,
      title: "trabajo",
      tasks: [{
        id: 1111,
        orderNumber: 1,
        content: "trabajar"
      }],
      tasksDone: [],
      showTasksDone: true

    },
    {
      id: 3,
      color: "#d6d62",
      icon: "unordered-list",
      orderNumber: 3,
      title: "trabajo",
      tasks: [{
        id: 1111,
        orderNumber: 1,
        content: "trabajar"
      }],
      tasksDone: [],
      showTasksDone: true
    }
  ]
  
  const [configInfo, setConfigInfo] = useState<ConfigInfo>(initialCofigInfo)
  const [lenguage, setLenguage] = useState("es")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(colorScheme === "dark" ? true : false)
  const [lists, setLists] = useState<ListType[]>(testLists)
  
  useEffect(() => {
    const appInfo = {lenguage, isDarkMode, lists}
    AsyncStorage.setItem("appInfoStorage", JSON.stringify(appInfo))
  }, [lenguage, isDarkMode, lists])

  return (
    <TaskContext.Provider 
      value={{
        configInfo,
        lenguage,
        isDarkMode,
        lists,
        setConfigInfo,
        setLenguage,
        setIsDarkMode,
        setLists
      }}>
      {children}
    </TaskContext.Provider>
  )
}

export {TaskProvider}

export default TaskContext