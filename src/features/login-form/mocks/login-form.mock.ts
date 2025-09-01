import { toast } from "sonner";

jest.mock("@/shared/query-options", () => ({
  createAuthQueryOptions: jest.fn(() => ({ queryKey: ["auth"] })),
}));

const mockLoginMutation = jest.fn();
jest.mock("../query-options/create-login-muataion-options", () => ({
  createLoginMutationOptions: () => ({
    mutationKey: ["login"],
    mutationFn: mockLoginMutation,
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

export { mockLoginMutation, navigateMock };