import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createUpdateAnswerMutationOptions = (id: number) => {
  return mutationOptions({
    mutationKey: ["update-answer"],
    mutationFn: (content: string) => updateAnswer(id, content),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Answer was changed!");
    },
  });
};

const updateAnswer = async (
  id: number,
  content: string
): Promise<FetchedData<Snippet>> => {
  const res = await fetch(`/api/answers/${id}`, {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
