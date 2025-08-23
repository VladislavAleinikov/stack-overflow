import type { PaginatedData, User } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

export const createGetUsersQueryOptions = (params: URLSearchParams) => {
  return queryOptions({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 3 * 60 * 1000,
  });
};

const getUsers = async (
  params: URLSearchParams
): Promise<PaginatedData<User>> => {
  const res = await fetch(`/api/users?${params}`);

  const data = await res.json();

  return data.data;
};
