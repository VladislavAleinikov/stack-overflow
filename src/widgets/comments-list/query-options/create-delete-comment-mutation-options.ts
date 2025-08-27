import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CommentRequest } from "../types";

export const createDeleteCommentMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["delete-comment"],
    mutationFn: deleteComment,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Comment removed.");
    },
  });
};

const deleteComment = async(
  id: number
): Promise<FetchedData<Snippet>> => {
  const res = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
