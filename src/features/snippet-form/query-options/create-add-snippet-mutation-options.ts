import type { FetchedData, Snippet } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SnippetRequest } from "../types";

export const createAddSnippetMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["add-snippet"],
    mutationFn: addSnippet,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "New snippet added successfully!");
    },
  });
};

const addSnippet = async (body: SnippetRequest): Promise<FetchedData<Snippet>> => {
  const res = await fetch("/api/snippets", {
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
