import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist'

import useTask from '../hooks/useTask'
import theme from '../theme/theme'
import { translate } from '../utils'
import type { ListType, RootStackParamList } from '../types'

export default function OrderLists() {
  const { lists, setLists, isDarkMode, lenguage } = useTask()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [orderedLists, setOrderedLists] = useState<ListType[]>(() => [...lists])

  function translateFn(text: string) {
    return translate({ text, lenguage })
  }

  useEffect(() => {
    setOrderedLists([...lists])
  }, [lists])

  const textColor = isDarkMode ? theme.colors.textColor.dark : theme.colors.textColor.light
  const cardColor = isDarkMode ? theme.colors.secondBaseColor.dark : theme.colors.secondBaseColor.light
  const buttonColor = isDarkMode ? theme.colors.lightBlue2 : theme.colors.lightBlue

  const handleSave = () => {
    setLists(
      orderedLists.map((list, index) => ({
        ...list,
        orderNumber: index + 1,
      }))
    )
    navigation.goBack()
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.colors.baseColor.dark : theme.colors.baseColor.light }]}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          style={[styles.headerButton, { backgroundColor: cardColor }]}
        >
          <Ionicons name="arrow-back" size={20} color={textColor} />
          <Text style={[styles.headerButtonText, { color: textColor }]}>{translateFn('back')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          style={[styles.headerButton, { backgroundColor: buttonColor }]}
        >
          <Feather name="check" size={20} color={theme.colors.white} />
          <Text style={[styles.headerButtonText, { color: theme.colors.white }]}>{translateFn('save')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerTitleRow}>
        <Text style={[styles.title, { color: textColor }]}>{translateFn('orderListsTitle')}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.dragArea}>
          <DraggableFlatList
            data={orderedLists}
            keyExtractor={(item) => String(item.id)}
            onDragEnd={({ data }) => setOrderedLists(data.map((list, index) => ({ ...list, orderNumber: index + 1 })))}
            activationDistance={12}
            scrollEnabled={false}
            contentContainerStyle={styles.content}
            ListEmptyComponent={(
              <View style={[styles.emptyBox, { backgroundColor: cardColor }]}>
                <Text style={[styles.emptyText, { color: textColor }]}>{translateFn('listNotFound')}</Text>
              </View>
            )}
            renderItem={({ item, drag, isActive }: RenderItemParams<ListType>) => (
              <View
                style={[
                  styles.listRow,
                  {
                    backgroundColor: isActive ? buttonColor : cardColor,
                    opacity: isActive ? 0.95 : 1,
                  }
                ]}
              >
                <View style={styles.rowLeft}>
                  <AntDesign name={item.icon as keyof typeof AntDesign.glyphMap} size={22} color={item.color} />
                  <Text style={[styles.listTitle, { color: textColor }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onLongPress={drag}
                  delayLongPress={80}
                  style={styles.dragHandle}
                >
                  <Ionicons name="reorder-two-outline" size={22} color={textColor} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTopRow: {
    paddingTop: Platform.OS === 'ios' ? 64 : 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerButton: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitleRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  dragArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  listRow: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
    flex: 1,
  },
  dragHandle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  emptyBox: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
})
