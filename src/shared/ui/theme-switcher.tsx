import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useColorScheme } from "@mui/material/styles";
import ContrastIcon from "@mui/icons-material/Contrast";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const { mode, setMode, colorScheme } = useColorScheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSetMode = (newMode: "light" | "dark" | "system") => () =>
    setMode(newMode);

  useEffect(() => {
    if (colorScheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [colorScheme]);

  if (!mode) {
    return;
  }

  return (
    <div>
      <IconButton size="large" onClick={handleClick}>
        <LightModeIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <DarkModeIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={onSetMode("system")}>
          <ContrastIcon className="w-4 h-4 mr-2" />
          System
        </MenuItem>
        <MenuItem onClick={onSetMode("dark")}>
          <DarkModeIcon className="w-4 h-4 mr-2" />
          Dark
        </MenuItem>
        <MenuItem onClick={onSetMode("light")}>
          <LightModeIcon className="w-4 h-4 mr-2" />
          Light
        </MenuItem>
      </Menu>
    </div>
  );
};
