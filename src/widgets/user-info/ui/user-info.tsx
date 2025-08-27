import {
  createAuthQueryOptions,
  createLogoutMutationOptions,
  createUserQueryOptions,
} from "@/shared/query-options";
import type { FCWithSkeleton } from "@/shared/types";
import { AlertDialog } from "@/shared/ui/alert-dialog";
import { Avatar, Button, IconButton, Paper, Skeleton } from "@mui/material";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { parseStatistic } from "../utils";
import { createDeleteUserMutationOptions } from "../query-options/create-delete-user-mutation-options";

interface UserInfoProps {
  userId: number;
}

export const UserInfo: FCWithSkeleton<UserInfoProps> = ({ userId }) => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const { mutateAsync: logout } = useMutation(createLogoutMutationOptions());
  const { mutateAsync: deleteUser } = useMutation(createDeleteUserMutationOptions());
  const { data: user } = useSuspenseQuery(createUserQueryOptions(userId));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onLogout = async () => {
    logout().then(() => {
      queryClient.invalidateQueries({
        queryKey: createAuthQueryOptions().queryKey,
      });
      navigate("/");
    })
  };

  const onDelete = async () => {
    deleteUser().then(() => {
      queryClient.invalidateQueries({
        queryKey: createAuthQueryOptions().queryKey,
      });
      navigate("/");
    })
  }

  if (user === null) {
    return (
      <Paper className="p-16 flex flex-col justify-center items-center space-y-4">
        <h1>404</h1>
        <h3>User not found!</h3>
        <Button variant="contained" onClick={() => navigate("/")}>
          Return to home page
        </Button>
      </Paper>
    );
  }

  const parsedStatistic = parseStatistic(user.statistic);

  return (
    <Paper className="w-[80%] p-16 flex justify-around">
      <div className="flex flex-col space-y-1">
        <Avatar className="w-20 h-20 text-6xl">{user.username[0]}</Avatar>
        <h6>{user.username}</h6>
        <p className="text-xs italic">Id: {user.id}</p>
        <p className="text-xs italic">Role: {user.role}</p>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/users/${userId}/snippets`)}
        >
          Snippets
        </Button>
        {authUser?.id === userId && (
          <div className="space-x-2">
            <IconButton
              className="shadow-lg"
              color="error"
              size="large"
              onClick={() => setIsAlertOpen(true)}
            >
              <DeleteIcon className="w-5 h-5" />
            </IconButton>
            <IconButton className="shadow-lg" size="large" onClick={onLogout}>
              <LogoutIcon className="w-5 h-5" />
            </IconButton>
            <AlertDialog
              open={isAlertOpen}
              title="Are you shure you want to delete your account?"
              text="This action can't be canceled"
              onConfirm={onDelete}
              onClose={() => setIsAlertOpen(false)}
            />
          </div>
        )}
      </div>
      <div>
        {parsedStatistic.map(([stat, val]) => (
          <p className="text-end" key={stat}>
            <span className="font-bold capitalize">{stat}:</span> {val}
          </p>
        ))}
      </div>
    </Paper>
  );
};

UserInfo.Skeleton = () => {
  return (
    <Paper className="w-[80%] p-16 flex justify-around">
      <div className="space-y-1">
        <Skeleton variant="circular" className="w-20 h-20" />
        <Skeleton variant="text" className="w-[90px] text-lg" />
        <Skeleton variant="text" className="w-[40px] text-xs" />
        <Skeleton variant="text" className="w-[50px] text-xs" />
      </div>
      <div>
        <p className="text-end">
          <Skeleton variant="text" className="inline-block w-[55px] mr-2" />
          <Skeleton variant="text" className="inline-block w-[10px]" />
        </p>
        <p className="text-end">
          <Skeleton variant="text" className="inline-block w-[40px] mr-2" />
          <Skeleton variant="text" className="inline-block w-[10px]" />
        </p>
        <p className="text-end">
          <Skeleton variant="text" className="inline-block w-[60px] mr-2" />
          <Skeleton variant="text" className="inline-block w-[10px]" />
        </p>
        <p className="text-end">
          <Skeleton variant="text" className="inline-block w-[35px] mr-2" />
          <Skeleton variant="text" className="inline-block w-[10px]" />
        </p>
        <p className="text-end">
          <Skeleton variant="text" className="inline-block w-[50px] mr-2" />
          <Skeleton variant="text" className="inline-block w-[10px]" />
        </p>
        <p className="text-end">
          <Skeleton variant="text" className="inline-block w-[65px] mr-2" />
          <Skeleton variant="text" className="inline-block w-[10px]" />
        </p>
        <p className="text-end">
          <Skeleton variant="text" className="inline-block w-[95px] mr-2" />
          <Skeleton variant="text" className="inline-block w-[10px]" />
        </p>
        <p className="text-end">
          <Skeleton variant="text" className="inline-block w-[95px] mr-2" />
          <Skeleton variant="text" className="inline-block w-[10px]" />
        </p>
      </div>
    </Paper>
  );
};
