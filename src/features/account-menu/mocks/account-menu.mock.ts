import { UserRole, type User } from "@/shared/types";
import { toast } from "sonner";

const mockLogoutMutation = jest.fn();
jest.mock("@/shared/query-options", () => ({
  createAuthQueryOptions: jest.fn(() => ({ queryKey: ["auth"] })),
  createLogoutMutationOptions: () => ({
    mutationKey: ["logout"],
    mutationFn: mockLogoutMutation,
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

const currentUserMock: User = {
  id: 1,
  username: "username",
  role: UserRole.USER,
};

export { mockLogoutMutation, navigateMock, currentUserMock};