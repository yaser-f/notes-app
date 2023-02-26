// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      // bg
      bg: string;
      bg2: string;
      // blue
      primary: string;
      // text
      textPri: string;
      textSec: string;
      textTer: string;
      // border colors
      inputBorder: string;
      hrBorder: string;
      // hover colors
      hover: string;
      tweetHover: string;
      priHover: string;
      iconHover: string;

      // transparent
      transparent: string;
      error: string;
    };
    transition: string;
    borderRadius: string;
    font: {
      size: {
        h1: string;
        h2: string;
        lg: string;
        md: string;
        sm: string;
      };
      weight: {
        bold: string;
        normal: string;
        light: string;
      };
    };
  }
}
