import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Outlet } from 'react-router-native'
import theme from '../theme/theme'

export default function Layout() {
  return (
    <>
      <View style={styles.container}>
        <Outlet/>
      </View>
      <Text style={styles.publicidad} >Publicidad</Text>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  publicidad: {
    display: "flex",
    bottom: 0,
    left: 0,
    width: "100%",
    height: theme.bannerHeight,
    backgroundColor: "#6baa9d",
    textAlign: "center",
    textAlignVertical: "center",
    zIndex: 100
  }
})