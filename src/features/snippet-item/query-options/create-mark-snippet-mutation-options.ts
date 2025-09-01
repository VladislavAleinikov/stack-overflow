import type { FetchedData, MarkType } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createMarkSnippetMutationOptions = (snippetId: number) => {
  return mutationOptions({
    mutationKey: ["snippets-rating", snippetId],
    mutationFn: (mark: MarkType) => markSnippet(snippetId, mark),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

const markSnippet = async (
  snippetId: number,
  mark: MarkType
): Promise<FetchedData<{ mark: MarkType }>> => {
  const res = await fetch(`/api/snippets/${snippetId}/mark`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mark }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
