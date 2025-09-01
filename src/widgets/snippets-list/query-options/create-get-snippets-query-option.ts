import type { PaginatedData, Snippet } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

export const createGetSnippetsQueryOptions = (params: URLSearchParams) => {
  return queryOptions({
    queryKey: ["snippets", params],
    queryFn: () => getSnippets(params),
    staleTime: 3 * 60 * 1000,
  });
};

const getSnippets = async (
  params: URLSearchParams
): Promise<PaginatedData<Snippet>> => {
  const res = await fetch(`/api/snippets?${params}`);

  const data = await res.json();

  return data.data;
};
