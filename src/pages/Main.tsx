import React, { useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types';

import useTask from '../hooks/useTask';
import theme from '../theme/theme';

import List from '../components/List';
import NewListModal from '../components/modals/NewListModal';
import ConfigModal from '../components/modals/ConfigModal';
import ConfigGear from '../components/basic/svg/ConfigGear';
import { Entypo } from '@expo/vector-icons';

export default function Main() {
  const {lists, isDarkMode} = useTask()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const [newListModal, setNewListModal] = useState(false)
  const [configModal, setConfigModal] = useState(false)

  const bgColorStyleValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current

  const bgColorStyles = {
    backgroundColor: bgColorStyleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.baseColor.light, theme.colors.baseColor.dark]
    })
  }

  useEffect(() => {
    Animated.timing(bgColorStyleValue, {
      toValue: isDarkMode ? 1 : 0,
      duration: 100,
      useNativeDriver: false
    }).start()
  }, [isDarkMode])

  return (
    <Animated.View style={[styles.container, bgColorStyles]}>
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
          <List
            key={listInfo.id}
            list={listInfo}
            onPress={() => navigation.navigate('TaskPage', { listId: listInfo.id })}
          />
        )}
      </View>

      {newListModal && <NewListModal setModal={setNewListModal}/>}
      {configModal && <ConfigModal setIsVisible={setConfigModal}/>}
    </Animated.View>
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