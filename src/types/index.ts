export type ConfigInfo = {
    baseColor: string,
    buttonsColor: string,
    textColor: string
}

export type Task = {
  id: number,
  orderNumber: number,
  content: string
}

export type ListType = {
  id: number,
  orderNumber: number,
  color: string,
  icon: string,
  title: string,
  tasks: Task[] | [],
  tasksDone: Task[] | [],
  showTasksDone: boolean
}

export type Layout = {
  x: number,
  y: number,
  width: number,
  height: number
}

export type RootStackParamList = {
  Load: undefined,
  Main: undefined,
  TaskPage: { listId: number },
}

export type TaskContextProps = {   
    configInfo: ConfigInfo,
    lenguage: string,
    isDarkMode: boolean,
    lists: ListType[] | [],
    addsInitialized: boolean,
    runAnimationAfterList: boolean,
    setConfigInfo: React.Dispatch<React.SetStateAction<ConfigInfo>>,
    setLenguage: React.Dispatch<React.SetStateAction<string>>,
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
    setLists: React.Dispatch<React.SetStateAction<ListType[] | []>>,
    setRunAnimationAfterList: React.Dispatch<React.SetStateAction<boolean>>
}