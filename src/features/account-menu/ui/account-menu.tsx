import { Avatar, Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import React, { useState } from "react";
import type { User } from "@/shared/types";
import { createAuthQueryOptions, createLogoutMutationOptions } from "@/shared/query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

interface AccountMenuProps{
  user: User
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ user }) => {
  const { mutateAsync: logout } = useMutation(createLogoutMutationOptions());
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = async () => {
    await logout();
    await queryClient.invalidateQueries({
      queryKey: createAuthQueryOptions().queryKey,
    });
    navigate("/");
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        className="flex items-center ml-8 my-2 py-2 pr-6 rounded-lg text-muted-foreground normal-case"
      >
        <Avatar className="w-5 h-5 mr-2 text-sm">
          {user.username[0]}
        </Avatar>
        {user.username}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className=" z-[99999]"
      >
        <MenuItem onClick={() => navigate("/users/me")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

