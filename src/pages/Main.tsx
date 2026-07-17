import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Platform, StatusBar, StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { Layout, RootStackParamList } from '../types';
import { Entypo } from '@expo/vector-icons';
import MaterialDesignIcons  from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient'

import useTask from '../hooks/useTask';
import theme from '../theme/theme';
import { translate } from '../utils';

import List from '../components/List';
import NewListModal from '../components/modals/ListModal';
import ConfigModal from '../components/modals/ConfigModal';
import ConfigGear from '../components/basic/svg/ConfigGear';
import CurveArrowSVG from '../components/basic/svg/CurveArrowSVG';

export default function Main() {
  const { lists, isDarkMode, runAnimationAfterList, setRunAnimationAfterList, lenguage } = useTask()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  function translateFn(text: string) {
    return translate({ text, lenguage })
  }

  const [newListModal, setNewListModal] = useState(false)
  const [configModal, setConfigModal] = useState(false)
  //capa usada para la animacion de cambio de pagina, se monta al entrar a una lista
  //queda montada y se desmonta al volver
  const [showPageChangeAnimation, setShowPageChangeAnimation] = useState(false)
  const [selectedListId, setSelectedListId] = useState<number | null>(null)
  const animationParams = useRef({ x: 0, y: 0, width: 0, height: 0 }).current
  const changeToListAnimationValue = useRef(new Animated.Value(0)).current
  const selectedList = selectedListId === null ? undefined : lists.find(list => list.id === selectedListId)

  const bgColorStyleValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current
  const bgColor = isDarkMode ? theme.colors.baseColor.dark : theme.colors.baseColor.light
  const bgColorWithOpacity = isDarkMode ? theme.colors.baseColor.transparentDark : theme.colors.baseColor.transparentLight
  const listColor = isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.secondBaseColor.light
  console.log(lists.length, lists)
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

  //si la lista seleccionada fue eliminada mientras la shell de transicion seguia montada, se limpia el estado para no intentar renderizarla
  useEffect(() => {
    if (showPageChangeAnimation && selectedListId !== null && !selectedList) {
      setShowPageChangeAnimation(false)
      setSelectedListId(null)
      changeToListAnimationValue.setValue(0)
    }
  }, [changeToListAnimationValue, selectedList, selectedListId, showPageChangeAnimation])

  return (
    <Animated.View style={[styles.container, bgColorStyles]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          lists.length === 0 ? styles.emptyListContent : styles.listsContent,
          { paddingBottom: 16 }
        ]}
        style={styles.scrollView}
      >
        {/* if there is no lists shows a message on how to start */}
        {lists.length === 0 ?
          <View style={styles.emptyListContainer}>
            <Text
              style={[
                styles.emptyListText,
                { color: isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light }
              ]}
            >
              {translateFn("emptyLists1")}
            </Text>
            <Text
              style={[
                styles.emptyListText,
                { color: isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light }
              ]}
            >
              {translateFn("emptyLists2")}
              <Entypo
                name="add-to-list"
                size={24}
                color={isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light}
              />
            </Text>
          </View>
          :
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
        }
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
        <View style={styles.addAndOrderButtonsContainer}>
          <TouchableOpacity
            style={styles.btnNewList}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('OrderLists')}
            >
            <MaterialDesignIcons style={{ transform: [{ translateX: 1 }] }} name="unfold-more-vertical" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnNewList}
            activeOpacity={0.9}
            onPress={() => setNewListModal(true)}
            >
            <Entypo style={{ transform: [{ translateX: 1 }] }} name="add-to-list" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {newListModal && <NewListModal setModal={setNewListModal} />}
      {configModal && <ConfigModal setIsVisible={setConfigModal} />}

      {showPageChangeAnimation && selectedList &&
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
              list={selectedList}
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
  emptyListContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 40
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 20,
    paddingHorizontal: 40,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 120 : 96
  },
  listsContent: {
    paddingTop: Platform.OS === "ios" ? 120 : 96
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
    marginRight: 0
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
  },
  addAndOrderButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: theme.colors.lightBlue2,
    borderRadius: 20,
  }
});