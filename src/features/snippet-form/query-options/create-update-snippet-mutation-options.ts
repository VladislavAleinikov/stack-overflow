import type { FetchedData, Languages, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createUpdateSnippetMutationOptions = (id: number) => {
  return mutationOptions({
    mutationKey: ["update-snippet"],
    mutationFn: (body: { code: string; language: Languages }) =>
      updateSnippet(id, body),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

const updateSnippet = async (
  id: number,
  body: {
    code: string;
    language: Languages;
  }
): Promise<FetchedData<Snippet>> => {
  const res = await fetch(`/api/snippets/${id}`, {
    method: "PATCH",
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
