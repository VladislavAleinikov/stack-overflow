import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class"
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "rgb(23, 23, 23)",
          contrastText: "rgb(250, 250, 250)",
        },
        secondary: {
          main: "rgb(245, 245, 245)",
          contrastText: "rgb(23, 23, 23)",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "rgb(229, 229, 229)",
          contrastText: "rgb(23, 23, 23)",
        },
        secondary: {
          main: "rgb(38, 38, 38)",
          contrastText: "rgb(250, 250, 250)",
        },
      },
    },
  },
});