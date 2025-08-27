import type { PaginatedData, Question } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

export const createGetQuestionsQueryOptions = (params: URLSearchParams) => {
  return queryOptions({
    queryKey: ["questions", params],
    queryFn: () => getQuestions(params),
    staleTime: 3 * 60 * 1000,
  });
};

const getQuestions = async (
  params: URLSearchParams
): Promise<PaginatedData<Question>> => {
  const res = await fetch(`/api/questions?${params}`);

  const data = await res.json();

  return data.data;
};
