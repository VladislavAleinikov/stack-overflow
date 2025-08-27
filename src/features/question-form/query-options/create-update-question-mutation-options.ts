import type { FetchedData, Question } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QuestionRequest } from "../types";

export const createUpdateQuestionMutationOptions = (id: number) => {
  return mutationOptions({
    mutationKey: ["update-question"],
    mutationFn: (body: QuestionRequest) =>
      updateQuestion(id, body),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Your question was updated.");
    },
  });
};

const updateQuestion = async (
  id: number,
  body: QuestionRequest
): Promise<FetchedData<Question>> => {
  const res = await fetch(`/api/questions/${id}`, {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
