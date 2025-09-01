import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AnswerRequest } from "../types";

export const createAddAnswerMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["add-answer"],
    mutationFn: addAnswer,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "New answer added successfully!");
    },
  });
};

const addAnswer = async (
  body: AnswerRequest
): Promise<FetchedData<Snippet>> => {
  const res = await fetch("/api/answers", {
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
