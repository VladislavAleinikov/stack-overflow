import type { FetchedData, User } from "@/shared/types";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createLoginMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["login"],
    mutationFn: login,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

const login = async (body: {
  username: string;
  password: string;
}): Promise<FetchedData<User>> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": import.meta.env.VITE_SERVER_URL,
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Request-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
