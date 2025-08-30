import { toast } from "sonner";

jest.mock("@/shared/query-options", () => ({
  createAuthQueryOptions: jest.fn(() => ({ queryKey: ["auth"] })),
}));

const mockRegisterMutation = jest.fn();
jest.mock("../query-options/create-register-mutation-options", () => ({
  createRegisterMutationOptions: () => ({
    mutationKey: ["register"],
    mutationFn: mockRegisterMutation,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

const navigateMock = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => navigateMock,
}));

export { mockRegisterMutation, navigateMock };
