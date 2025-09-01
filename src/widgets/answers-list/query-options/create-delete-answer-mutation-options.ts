import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createDeleteAnswerMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["delete-answer"],
    mutationFn: deleteAnswer,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Answer removed.");
    },
  });
};

const deleteAnswer = async (id: number): Promise<FetchedData<Snippet>> => {
  const res = await fetch(`/api/answers/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
