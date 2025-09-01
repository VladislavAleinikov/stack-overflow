import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createDeleteSnippetMutationOptions = (id: number) => {
  return mutationOptions({
    mutationKey: ["delete-snippet"],
    mutationFn: () => deleteSnippet(id),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

const deleteSnippet = async (id: number): Promise<FetchedData<Snippet>> => {
  const res = await fetch(`/api/snippets/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
