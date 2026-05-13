import React, { useState } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import useTask from '../hooks/useTask';
import theme from '../theme/theme';

import List from '../components/List';
import NewListModal from '../components/NewListModal';
import ConfigModal from '../components/ConfigModal';

export default function Main() {
  const {lists} = useTask()

  const [newListModal, setNewListModal] = useState(true)
  const [configModal, setConfigModal] = useState(false)

  return (
    <View style={styles.container}>
      <View style= {styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.btnNewList}
          activeOpacity={0.7}
          onPress={() => setNewListModal(true)}
          >
          <Text style={styles.btnNewListText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btnNewList}
          activeOpacity={0.7}
          onPress={() => setConfigModal(true)}
          >
          <Text style={styles.btnNewListText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listsContainer}>
        {lists.map(listInfo => 
          <List key={listInfo.id} list={listInfo}/>
        )}
      </View>

      {newListModal && <NewListModal setModal={setNewListModal}/>}
      {/* {configModal && <ConfigModal setModal={setConfigModal}/>} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingInline: 20

  },
    btnNewList: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lightBlue,
    borderRadius: "50%",
    alignSelf: "flex-end",
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