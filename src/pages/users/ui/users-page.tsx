import { UsersList } from "@/widgets/users-list";
import { Suspense } from "react";

export const UsersPage = () => {
  return (
    <div>
      <Suspense fallback={<UsersList.Skeleton />}>
        <UsersList />
      </Suspense>
    </div>
  );
};
