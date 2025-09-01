import React from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { theme } from "./consts";

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
};
