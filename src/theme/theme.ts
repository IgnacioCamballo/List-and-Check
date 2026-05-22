import { Platform } from "react-native"

const theme = {
  bannerHeight: Platform.OS === "ios" ? 70 : 80,
  banner: 
    // production adds
    Platform.OS === "ios" ? "ca-app-pub-4926030013898312/2756357550" : "ca-app-pub-4926030013898312/8531428410"
    
    // test ads
    //Platform.OS === "ios" ? "ca-app-pub-3940256099942544/2934735716" : "ca-app-pub-3940256099942544/2934735716"
    ,
    colors: {
    baseColor: {
      light: "#dedede",
      transparentLight: "rgba(222, 222, 222, 0)",
      dark: "#000000",
      transparentDark: "rgba(0, 0, 0, 0)"
    },
    secondBaseColor: {
      dark: "#1a1a1a",
      transparentDark: "rgba(26, 26, 26, 0)",
      light: "#e7e7e7",
      transparentLight: "rgba(231, 231, 231, 0)"
    },
    sectionColor: {
      light: "#f5f5f5",
      dark: "#222222"
    },
    textColor: {
      light: "#000000",
      dark: "#e2e2e2"
    },
    secondTextColor: {
      light: "#4b4b4b",
      dark: "#a5a5a5"
    },
    tirthTextColor: {
      light: "#7c7c7c",
      dark: "#5e5e5e"
    },
    buttonColor: {
      light: "#e0e0e0",
      dark: "#2c2c2c"
    },
    listColor: {
      light: "#ededed",
      dark: "#373737"
    },
    greenSuccess: {
      light: "#9eeba1",
      dark: "#78b87a"
    },
    white: "#ffffff",
    lightGrey: "#d9d9d9",
    grey: "#444444",
    darkGrey: "#1a1a1a",
    black: "#000000",
    lightBlue: "#838ea5",
    red: "#d62323",
    lightRed: "#ab4d4d",
  },
  fontSizes: {
    F24: 24,
    F22: 22,
    F20: 20,
    F18: 18,
    F16: 16,
    F14: 14,
    F12: 12,
    F10: 10,
  }
}

export default theme