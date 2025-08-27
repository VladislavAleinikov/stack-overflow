import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CommentRequest } from "../types";

export const createAddCommentMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["add-comment"],
    mutationFn: addComment,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "New comment added successfully!");
    },
  });
};

const addComment = async (
  body: CommentRequest
): Promise<FetchedData<Snippet>> => {
  const res = await fetch("/api/comments", {
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
