import React, { useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import type { RootStackParamList } from '../types'

import theme from '../theme/theme'
import useTask from '../hooks/useTask'

import LoadScreen from './LoadScreen'
import Main from './Main'
import TaskPage from './TaskPage'

const Stack = createNativeStackNavigator<RootStackParamList>()

type RouteName = keyof RootStackParamList

function RouterContent({ routeName }: { routeName: RouteName }) {
  const { isDarkMode, configInfo, addsInitialized } = useTask()

  const statusBarColor = routeName === 'Load' ? '#ffffff' : configInfo.baseColor
  const statusBarTextStyle = routeName === 'Load' ? 'dark-content' : isDarkMode ? 'light-content' : 'dark-content'

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarTextStyle} />
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName="Load"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Load" component={LoadScreen} />
          <Stack.Screen name="Main" component={Main} options={{ animation: 'none' }}/>
          <Stack.Screen name="TaskPage" component={TaskPage} options={{ animation: 'none' }} />
        </Stack.Navigator>
      </View>
      
      {addsInitialized && 
        <View style={styles.publicidad}>
          <BannerAd 
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            unitId={theme.banner}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true
            }}
          />
        </View>
      }
    </View>
  )
}

export default function Router() {
  const [routeName, setRouteName] = useState<RouteName>('Load')

  return (
    <NavigationContainer
      onStateChange={(state) => {
        const currentRoute = state?.routes[state.index]?.name
        if (currentRoute) {
          setRouteName(currentRoute as RouteName)
        }
      }}
    >
      <RouterContent routeName={routeName} />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    flex: 1
  },
  publicidad: {
    width: '100%',
    height: theme.bannerHeight,
    zIndex: 100
  },
});
