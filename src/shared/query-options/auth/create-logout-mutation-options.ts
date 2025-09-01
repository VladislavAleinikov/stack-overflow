import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const createLogoutMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["logout"],
    mutationFn: login,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Successfully logged out!");
    },
  });
};

const login = async (): Promise<void> => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Something went wrong, try again later!");
  }
};
