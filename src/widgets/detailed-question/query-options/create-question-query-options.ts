import type { Question } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

export const createQuestionQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id),
    staleTime: 3 * 60 * 1000,
  });
};

const getQuestion = async (
  id: number
): Promise<Question | null> => {
  const res = await fetch(`/api/questions/${id}`);

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data.data;
};
