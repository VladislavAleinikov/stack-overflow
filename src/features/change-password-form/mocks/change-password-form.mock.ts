import { toast } from "sonner";

const mockChangePasswordMutation = jest.fn();
jest.mock("../query-options/create-change-password-mutation-options", () => ({
  createChangePasswordMutationOptions: () => ({
    mutationKey: ["change-password"],
    mutationFn: mockChangePasswordMutation,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

export { mockChangePasswordMutation };