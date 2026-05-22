import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Platform, StatusBar, StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { Layout, RootStackParamList } from '../types';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'

import useTask from '../hooks/useTask';
import theme from '../theme/theme';

import List from '../components/List';
import NewListModal from '../components/modals/ListModal';
import ConfigModal from '../components/modals/ConfigModal';
import ConfigGear from '../components/basic/svg/ConfigGear';

export default function Main() {
  const { lists, isDarkMode, runAnimationAfterList, setRunAnimationAfterList } = useTask()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const [newListModal, setNewListModal] = useState(false)
  const [configModal, setConfigModal] = useState(false)
  //capa usada para la animacion de cambio de pagina, se monta al entrar a una lista
  //queda montada y se desmonta al volver
  const [showPageChangeAnimation, setShowPageChangeAnimation] = useState(false)
  const [selectedListId, setSelectedListId] = useState<number | null>(null)
  const animationParams = useRef({ x: 0, y: 0, width: 0, height: 0 }).current
  const changeToListAnimationValue = useRef(new Animated.Value(0)).current

  const bgColorStyleValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current
  const bgColor = isDarkMode ? theme.colors.baseColor.dark : theme.colors.baseColor.light
  const bgColorWithOpacity = isDarkMode ? theme.colors.baseColor.transparentDark : theme.colors.baseColor.transparentLight
  const listColor = isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.secondBaseColor.light

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

  const animateTransitionStyle = {
    backgroundColor: changeToListAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [bgColor, listColor]
    }),
    width: changeToListAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [animationParams.width, Dimensions.get("screen").width]
    }),
    height: changeToListAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [animationParams.height, Dimensions.get("screen").height]
    }),
    top: changeToListAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [animationParams.y, 0]
    }),
    left: changeToListAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [animationParams.x, 0]
    }),
    opacity: changeToListAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    }),
    borderRadius: changeToListAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [24, 0]
    })
  }

  const AnimateTransitionIn = (layout: Layout, listId: number) => {
    animationParams.x = layout.x
    animationParams.y = layout.y + (Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0) //en android el status bar ocupa espacio dentro de la pantalla, por lo que se suma su altura para que la animacion quede bien posicionada
    animationParams.width = layout.width
    animationParams.height = layout.height
    setSelectedListId(listId)
    setShowPageChangeAnimation(true)

    Animated.timing(changeToListAnimationValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false
    }).start(() => {
      navigation.navigate('TaskPage', { listId })
    })
  }

  const AnimateTransitionOut = () => {
    Animated.timing(changeToListAnimationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      setShowPageChangeAnimation(false)
      setSelectedListId(null)
    })
  }

  useEffect(() => {
    if (runAnimationAfterList) {
      AnimateTransitionOut()
      setRunAnimationAfterList(false)
    }
  }, [runAnimationAfterList])

  return (
    <Animated.View style={[styles.container, bgColorStyles]}>
      <ScrollView
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ 
          paddingTop: Platform.OS === "ios" ? 120 : 96, 
          paddingBottom: 16 
        }}
        style={styles.scrollView}
      >
        <View style={styles.listsContainer}>
          {lists.map(listInfo =>
            <List
              isShell={false}
              key={listInfo.id}
              list={listInfo}
              onPress={AnimateTransitionIn}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={[bgColor, bgColorWithOpacity]}
          start={{ x: 0, y: 0.7 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setConfigModal(true)}
        >
          <ConfigGear width={40} height={40} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnNewList}
          activeOpacity={0.9}
          onPress={() => setNewListModal(true)}
        >
          <Entypo style={{ transform: [{ translateX: 1 }] }} name="add-to-list" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {newListModal && <NewListModal setModal={setNewListModal} />}
      {configModal && <ConfigModal setIsVisible={setConfigModal} />}

      {showPageChangeAnimation &&
        <Animated.View
          style={[
            styles.shell,
            {
              backgroundColor: animateTransitionStyle.backgroundColor,
              width: animateTransitionStyle.width,
              height: animateTransitionStyle.height,
              top: animateTransitionStyle.top,
              left: animateTransitionStyle.left,
              borderRadius: animateTransitionStyle.borderRadius,
            }
          ]}
        >
          <Animated.View style={{ flex: 1, borderWidth: 0, opacity: animateTransitionStyle.opacity }}>
            <List
              isShell={true}
              list={lists.find(list => list.id === selectedListId)!}
              onPress={() => { }}
            />
          </Animated.View>
        </Animated.View>
      }
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingInline: 20,
    paddingBottom: 12

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
  listsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 16,
    paddingInline: 20
  },
  scrollView: {
    flex: 1,
    zIndex: 1
  },
  shell: {
    position: "absolute",
    flex: 1,
    zIndex: 30,
    elevation: 30,
  }
});