import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createSetAnswerStateMutatioinOptions = (id: number) => {
  return mutationOptions({
    mutationKey: ["set-answer-state"],
    mutationFn: (state: "correct" | "incorrect") => setAnswerState(id, state),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Answer status was set!");
    },
  });
};

const setAnswerState = async (
  id: number,
  state: "correct" | "incorrect"
): Promise<FetchedData<Snippet>> => {
  const res = await fetch(`/api/answers/${id}/state/${state}`, {
    method: "PUT",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
