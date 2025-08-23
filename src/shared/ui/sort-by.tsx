import SortIcon from "@mui/icons-material/Sort";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

interface SortByProps {
  options: [string, string][];
  selectedOption: string | null,
  onChange: (option: string) => void
}

export const SortBy: React.FC<SortByProps> = ({ options,selectedOption, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState(
    selectedOption || options[0]
  );
  const open = Boolean(anchorEl);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    option: string
  ) => {
    setSelected(option);
    onChange(option);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClickListItem}
      >
        <SortIcon className="w-5 h-5 mr-2" />
        Sort by
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        {options.map(([name, value]) => (
          <MenuItem
            key={name}
            selected={value === selected}
            onClick={(event) => handleMenuItemClick(event, value)}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
