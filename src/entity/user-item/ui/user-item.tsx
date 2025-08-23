import type { FCWithSkeleton, User } from "@/shared/types";
import { Avatar, Card, Skeleton } from "@mui/material";
import { useNavigate } from "react-router";
import { useIsFetching } from "@tanstack/react-query";
import { cn } from "@/shared/utils";

interface UserItemProps {
  user: User;
}

export const UserItem: FCWithSkeleton<UserItemProps> = ({ user }) => {
  const { id, username, role } = user;
  const isFetchingUsers = useIsFetching({ queryKey: ["users"] });
  const navigate = useNavigate();

  return (
    <Card
      elevation={3}
      className={cn(
        "cursor-pointer w-[200px] h-[200px] flex flex-col justify-center items-center space-y-4 transition hover:shadow-md hover:bg-primary/5",
        isFetchingUsers && "opacity-50"
      )}
      onClick={() => navigate(`/users/${id}`)}
    >
      <Avatar className="w-16 h-16 text-4xl">{user.username[0]}</Avatar>
      <h5>{username}</h5>
      <span className="text-sx italic">Role: {role}</span>
    </Card>
  );
};

UserItem.Skeleton = () => {
  return <Skeleton variant="rounded" className="w-[200px] h-[200px]"/>;
};
