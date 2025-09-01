
import type { FetchedData } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createDeleteUserMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["delete-user"],
    mutationFn: deleteUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

const deleteUser = async (): Promise<FetchedData<unknown>> => {
  const res = await fetch(`/api/me`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
