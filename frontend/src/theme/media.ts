// value         |0px     600px    960px    1280px   1920px
// key           |xs      sm       md       lg       xl
// screen width  |--------|--------|--------|--------|-------->
// range         |   xs   |   sm   |   md   |   lg   |   xl

export type BreakPointKeyT = "xs" | "sm" | "md" | "lg" | "xl";

export const breakPointkeyValue = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const breakpoints = {
  /**
   * xs: 0 / sm: 600 / md: 960 / lg: 1280 / xl: 1920
   */
  up: (key: BreakPointKeyT) =>
    `@media only screen and (min-width: ${breakPointkeyValue[key]}px)`,
  /**
   * xs: 0 / sm: 600 / md: 960 / lg: 1280 / xl: 1920
   */
  down: (key: BreakPointKeyT) =>
    `@media only screen and (max-width: ${breakPointkeyValue[key]}px)`,
};
