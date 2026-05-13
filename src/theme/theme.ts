import { Platform } from "react-native"

const theme = {
    colors: {
        baseColor: {
          light: "#efefef",
          dark: "#272727"
        },
        textColor: {
          light: "#000000",
          dark: "#dedede"
        },
        buttonColor: {
          light: "#e0e0e0",
          dark: "#2c2c2c"
        },
        listColor: {
          light: "#ededed",
          dark: "#373737"
        },
        black: "#000000",
        white: "#ffffff",
        lightBlue: "#7b90bc"
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
    },
    bannerHeight: Platform.OS === "ios" ? 70 : 80,
    banners: {

        // the bottom ones are test ads
      calendar: "ca-app-pub-3940256099942544/9214589741",
    }
}

export default theme