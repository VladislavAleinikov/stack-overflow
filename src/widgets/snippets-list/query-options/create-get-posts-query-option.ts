import type { PaginatedData, Snippet } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

export const createGetPostsQueryOptions = (params: URLSearchParams) => {
  return queryOptions({
    queryKey: ["posts", params],
    queryFn: () => getPosts(params),
    staleTime: 3 * 60 * 1000,
  });
};

const getPosts = async (
  params: URLSearchParams
): Promise<PaginatedData<Snippet>> => {
  const res = await fetch(`/api/snippets?${params}`);

  const data = await res.json();

  return data.data;
};
