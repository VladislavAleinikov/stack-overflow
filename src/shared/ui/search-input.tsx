import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "../utils";

interface SearchInputProps {
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultSearchBy?: string[];
  searchByOptions?: string[];
  onSearchByChange?: (options: string[]) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  defaultValue,
  onChange,
  defaultSearchBy = [],
  searchByOptions,
  onSearchByChange,
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultSearchBy);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOptions([...selectedOptions, e.target.value]);
      onSearchByChange!([...selectedOptions, e.target.value]);
    } else {
      if (selectedOptions.length === 1) {
        toast.warning("Can't search by nothing!");
        return;
      }

      setSelectedOptions(
        selectedOptions.filter((option) => option !== e.target.value)
      );
      onSearchByChange!(
        selectedOptions.filter((option) => option !== e.target.value)
      );
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <FormControl variant="standard" className="w-[300px]">
      <InputLabel htmlFor="search" className="pr-8">
        {selectedOptions.length
          ? `Search by: ${selectedOptions.join(", ")}`
          : "Search..."}
      </InputLabel>
      <Input id="search" defaultValue={defaultValue} onChange={onChange} />
      {searchByOptions && (
        <>
          <IconButton
            onClick={handleClick}
            className="absolute right-0 top-1/2 -translate-y-3"
          >
            <ExpandMoreIcon className={cn("w-6 h-6 transition", open && "rotate-180")} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {searchByOptions.map((option) => (
              <MenuItem key={option}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedOptions.includes(option)}
                      value={option}
                      onChange={onCheckedChange}
                    />
                  }
                  label={<ListItemText primary={option} />}
                />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </FormControl>
  );
};
