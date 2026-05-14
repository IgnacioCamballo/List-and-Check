import React, { useRef } from 'react'
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../../theme/theme';
import SunSVG from '../svg/SunSVG';
import MoonSVG from '../svg/MoonSVG';


type ValueProps = {
  value: boolean,
  setValue: React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void)
}

export default function SliderTheme({value, setValue}: ValueProps) {
  const bgColorStylesValue = useRef(new Animated.Value(value ? 1 : 0)).current
  const translateStylesValue = useRef(new Animated.Value(value ? 1 : 0)).current
  
  const handlePress = () => {
    Animated.parallel([
      Animated.timing(bgColorStylesValue, {
        toValue: value ? 0 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateStylesValue, {
        toValue: value ? 0 : 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
    setValue(!value);
  }

  const BgColorStyles = {
    backgroundColor: bgColorStylesValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.lightGrey, theme.colors.darkGrey]
    })
  }
  const SlideColorStyles = {
    backgroundColor: bgColorStylesValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.white, theme.colors.grey]
    })
  }

  const translateStyles = {
    transform: [
      {
        translateX: translateStylesValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 24]
        })
      }
    ]
  }

  const opacityStyle = {
    opacity: bgColorStylesValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
  }

  const opacityStyleR = {
    opacity: bgColorStylesValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  }

  return (
    <TouchableOpacity
      activeOpacity={1} 
      onPress={() => handlePress()}
    >
      <Animated.View style={[styles.slide_exterior, BgColorStyles]}>
        <Animated.View style={[styles.slide_interior, translateStyles, SlideColorStyles]}>
          <Animated.View style={[styles.sunMoon, opacityStyle]}><SunSVG width={32} height={32}/></Animated.View>
          <Animated.View style={[styles.sunMoon, opacityStyleR]}><MoonSVG width={32} height={32}/></Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create ({ 
  slide_exterior: {
    flexDirection:"row",
    borderRadius: 24,
    width: 72,
    height: 48,
    alignItems: "center",
    position: "relative",
    top: 1,
  },
  slide_interior: {
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    position: "relative"
  },
  sunMoon: {
    position: "absolute",
    top: 4,
    left: 4,
  }
})
