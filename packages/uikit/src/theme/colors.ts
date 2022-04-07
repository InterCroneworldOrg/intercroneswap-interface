import { Colors } from "./types";

export const baseColors = {
  failure: "#f92936",
  primary: "#FFB807",
  primaryBright: "#393939",
  primaryDark: "#0098A1",
  secondary: "#FFC700",
  success: "#31D0AA",
  warning: "#FFB237",
  normalCard: "#232323",
};

export const additionalColors = {
  binance: "#F0B90B",
  overlay: "#B2B2B2",
  gold: "#FFC700",
  silver: "#B2B2B2",
  bronze: "#E7974D",
};

export const lightColors: Colors = {
  ...baseColors,
  ...additionalColors,
  background: "#1c1c1c",
  backgroundDisabled: "#E9EAEB",
  backgroundAlt: "#0a0a1e",
  backgroundAlt2: "rgba(255, 255, 255, 0.7)",
  cardBorder: "#1c1c1c",
  contrast: "#191326",
  dropdown: "#F6F6F6",
  dropdownDeep: "#EEEEEE",
  invertedContrast: "#FFFFFF",
  input: "#eeeaf4",
  inputSecondary: "#d7caec",
  tertiary: "transparent",
  text: "#FFFFFF",
  textDisabled: "#BDC2C4",
  textSubtle: "#565a69",
  disabled: "#E9EAEB",
  gradients: {
    grey: "linear-gradient(180deg, #08060C 0%, #3c3742 100%)",
    gold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  },
};

export const darkColors: Colors = {
  ...baseColors,
  ...additionalColors,
  secondary: "#08060C",
  background: "#08060B",
  backgroundDisabled: "#3c3742",
  backgroundAlt: "#27262c",
  backgroundAlt2: "rgba(39, 38, 44, 0.7)",
  cardBorder: "#383241",
  contrast: "#FFFFFF",
  dropdown: "#1E1D20",
  dropdownDeep: "#100C18",
  invertedContrast: "#191326",
  input: "#372F47",
  inputSecondary: "#262130",
  primaryDark: "#0098A1",
  tertiary: "#353547",
  text: "#F4EEFF",
  textDisabled: "#666171",
  textSubtle: "#B8ADD2",
  disabled: "#524B63",
  gradients: {
    grey: "linear-gradient(180deg, #08060C 0%, #3c3742 100%)",
    gold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  },
};
