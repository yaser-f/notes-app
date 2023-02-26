import { DefaultTheme } from "styled-components";

const myTheme: DefaultTheme = {
  colors: {
    bg: "rgb(0, 0, 0)", // black
    bg2: "rgb(13, 13, 13)", // dark gray
    primary: "rgb(29, 155, 240)", // blue
    // text
    textPri: "rgb(255, 255, 255)",
    textSec: "rgb(150, 150, 150)",
    textTer: "rgb(48, 48, 48)",
    // border colors
    inputBorder: "rgb(207, 217, 222)",
    hrBorder: "rgb(239, 243, 244)",
    // hover colors
    hover: "rgba(250, 250, 250, 0.1)", // used in nav link/white button
    priHover: "rgb(26, 140, 216)", // dark blue
    tweetHover: "rgba(0, 0, 0, 0.03)",
    iconHover: "rgba(29, 155, 240, 0.1)",
    // transparent
    transparent: "rgba(0, 0, 0, 0)",
    error: "red",
  },
  transition: "all 0.5s ease",
  borderRadius: "9999px",
  font: {
    size: {
      h1: "64px",
      h2: "31px",
      lg: "34px",
      md: "17px",
      sm: "14px",
    },
    weight: {
      bold: "700",
      normal: "400",
      light: "300",
    },
  },
};

export { myTheme };
