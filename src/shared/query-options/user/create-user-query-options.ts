import type { UserWithStatistic } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

export const createUserQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    retry: false,
  });
};

const getUser = async (id: number): Promise<UserWithStatistic | null> => {
  const res = await fetch(`/api/users/${id}/statistic`);
  
  if (!res.ok) {
    return null;
  }
  
  const data = await res.json();
  return data.data;
};
