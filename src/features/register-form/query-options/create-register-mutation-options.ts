import type { FetchedData, User } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createRegisterMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["register"],
    mutationFn: register,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

const register = async (body: {
  username: string;
  password: string;
}): Promise<FetchedData<User>> => {
  const res = await fetch("/api/register", {
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
