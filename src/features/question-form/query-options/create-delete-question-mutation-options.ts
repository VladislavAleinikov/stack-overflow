import type { FetchedData, Question } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createDeleteQuestionMutationOptions = (id: number) => {
  return mutationOptions({
    mutationKey: ["delete-question"],
    mutationFn: () => deleteQuestion(id),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

const deleteQuestion = async (id: number): Promise<FetchedData<Question>> => {
  const res = await fetch(`/api/questions/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
