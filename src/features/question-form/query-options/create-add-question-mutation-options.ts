import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QuestionRequest } from "../types";

export const createAddQuestionMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["add-question"],
    mutationFn: addQuestion,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "New question added successfully!");
    },
  });
};

const addQuestion = async (
  body: QuestionRequest
): Promise<FetchedData<Snippet>> => {
  const res = await fetch("/api/questions", {
    method: "POST",
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
