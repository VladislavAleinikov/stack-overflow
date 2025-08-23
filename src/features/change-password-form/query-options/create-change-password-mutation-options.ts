import type { FetchedData } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createChangePasswordMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["change-password"],
    mutationFn: changePassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

const changePassword = async (body: {
  oldPassword: string;
  newPassword: string;
}): Promise<FetchedData<{ username: string }>> => {
  const res = await fetch(`/api/me/password`, {
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
