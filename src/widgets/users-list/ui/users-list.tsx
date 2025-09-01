import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { createGetUsersQueryOptions } from "../query-options/create-get-users-query-options";
import { useEffect } from "react";
import { PaginatedList } from "@/features/paginated-list";
import { UserItem } from "@/entity/user-item";
import { sortOptions } from "../consts";

export const UsersList = () => {
  const [searchParams] = useSearchParams({
    page: "1",
    sortBy: "",
    search: "",
  });
  const queryClient = useQueryClient();
  const {
    data: { data: users, meta },
  } = useSuspenseQuery(createGetUsersQueryOptions(searchParams));



  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });
  }, [queryClient, searchParams]);

  return (
    <PaginatedList
      title="Users"
      meta={meta}
      itemsProps={users.map((user) => ({ user, key: user.id }))}
      ItemComponent={UserItem}
      sortOptions={sortOptions}
      className="flex-row flex-wrap justify-around"
    />
  );
};

UsersList.Skeleton = () => {
  return (
    <>
      <PaginatedList.Skeleton
        ItemComponent={UserItem}
        className="flex-row flex-wrap justify-around"
      />
    </>
  );
};
