import { toast } from "sonner";

jest.mock("@/shared/query-options", () => ({
  createAuthQueryOptions: jest.fn(() => ({ queryKey: ["auth"] })),
}));

const mockChangeUsernameMutation = jest.fn();
jest.mock("../query-options/create-change-username-mutation-options", () => ({
  createChangeUsernameMutationOptions: () => ({
    mutationKey: ["change-username"],
    mutationFn: mockChangeUsernameMutation,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

export { mockChangeUsernameMutation };