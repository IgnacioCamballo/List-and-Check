import React, { useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

import useTask from '../hooks/useTask';
import theme from '../theme/theme';

import List from '../components/List';
import NewListModal from '../components/modals/NewListModal';
import ConfigModal from '../components/modals/ConfigModal';
import ConfigGear from '../components/basic/svg/ConfigGear';
import { Entypo } from '@expo/vector-icons';

export default function Main() {
  const {lists} = useTask()

  const [newListModal, setNewListModal] = useState(false)
  const [configModal, setConfigModal] = useState(false)

  return (
    <View style={styles.container}>
      <View style= {styles.buttonContainer}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => setConfigModal(true)}
          >
          <ConfigGear width={40} height={40}/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btnNewList}
          activeOpacity={0.9}
          onPress={() => setNewListModal(true)}
          >
          <Entypo style={{transform: [{translateX: 1}]}} name="add-to-list" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.listsContainer}>
        {lists.map(listInfo => 
          <List key={listInfo.id} list={listInfo}/>
        )}
      </View>

      {newListModal && <NewListModal setModal={setNewListModal}/>}
      {configModal && <ConfigModal setIsVisible={setConfigModal}/>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingInline: 20,
    marginBottom: 12

  },
    btnNewList: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lightBlue,
    borderRadius: "50%",
    marginRight: 0,
    marginBottom: 12
  },
  btnNewListText: {
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 36
  },
  listsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 16,
    paddingInline: 20
  },
});