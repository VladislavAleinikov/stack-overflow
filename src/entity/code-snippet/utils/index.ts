import { materialDark, materialLight } from "@uiw/codemirror-theme-material";

export function getThemeStyle(
  mode: "light" | "dark" | "system" | undefined,
  systemMode: "light" | "dark" | undefined
) {
  if (mode === "dark") {
    return materialDark;
  } else if (mode === "light") {
    return materialLight;
  } else {
    return systemMode === "dark" ? materialDark : materialLight;
  }
}
