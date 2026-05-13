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
  borderColor: string,
  title: string,
  tasks: Task[] | [],
  tasksDone: Task[] | []
}

export type TaskContextProps = {   
    configInfo: ConfigInfo,
    lenguage: string,
    isDarkMode: boolean,
    lists: ListType[] | [],
    setConfigInfo: React.Dispatch<React.SetStateAction<ConfigInfo>>,
    setLenguage: React.Dispatch<React.SetStateAction<string>>,
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
    setLists: React.Dispatch<React.SetStateAction<ListType[] | []>>
}