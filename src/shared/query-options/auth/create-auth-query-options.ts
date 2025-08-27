import { queryOptions } from "@tanstack/react-query";

export const createAuthQueryOptions = () => {
  return queryOptions({
    queryKey: ["auth"],
    queryFn: auth,
    staleTime: Infinity,
    retry: false,
  });
};

const auth = async (): Promise<User | null> => {
  const res = await fetch("/api/auth");

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data.data;
};