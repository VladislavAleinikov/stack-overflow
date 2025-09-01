import type { Snippet } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

export const createSnippetQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["snippet", id],
    queryFn: () => getSnippet(id),
    staleTime: 3 * 60 * 1000,
  });
};

const getSnippet = async (
  id: number
): Promise<Snippet | null> => {
  const res = await fetch(`/api/snippets/${id}`);

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data.data;
};
