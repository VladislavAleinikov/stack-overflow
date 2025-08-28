import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../ui/login-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
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

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const navigateMock = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => navigateMock,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it("renders form elements correctly", () => {
    renderComponent();

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account yet?/)).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/username must be at least 5 characters long/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be at least 6 characters long/i)
    ).toBeInTheDocument();
  });

  it("shows validation errors when password is long", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(
      screen.getByLabelText(/password/i),
      "veryLongPassword123456789"
    );
    const submitButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/max password length is 16 characters/i)
    ).toBeInTheDocument();
  });

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup();
    mockLoginMutation.mockResolvedValueOnce({ message: "Login successful" });
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockLoginMutation).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
      expect(navigateMock).toHaveBeenCalledWith("/");
      expect(toast.success).toHaveBeenCalledWith("Login successful");
    });
  });

  it("handles login error correctly", async () => {
    const user = userEvent.setup();
    const errorMessage = "Invalid credentials";
    mockLoginMutation.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockLoginMutation).toHaveBeenCalledWith({
        username: "testuser",
        password: "wrongpassword",
      });
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(screen.getByLabelText(/username/i)).toHaveFocus();
    });
  });

  it("disables button while pending", async () => {
    const user = userEvent.setup();
    mockLoginMutation.mockImplementationOnce(() => new Promise(() => {}));
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/password/i), "password123");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
