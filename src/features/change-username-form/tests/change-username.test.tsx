import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChangeUsernameForm } from "../ui/change-username-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
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

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));


describe("ChangeUsername", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (currentUsername: string) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ChangeUsernameForm userId={1} currentUsername={currentUsername} />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it("renders form elements correctly", () => {
    const username = "User123";
    renderComponent(username);

    expect(screen.getByText("Change username")).toBeInTheDocument();
    const input = screen.getByLabelText(/username/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(username);
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when field is empty", async () => {
    const user = userEvent.setup();
    renderComponent("username");

    await user.clear(screen.getByLabelText(/username/i));
    const submitButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/username must be at least 5 characters long/i)
    ).toBeInTheDocument();
  });

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup();
    mockChangeUsernameMutation.mockResolvedValueOnce({ message: "Username was changed" });
    renderComponent("");

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockChangeUsernameMutation).toHaveBeenCalledWith({
        username: "testuser",
      });
      expect(toast.success).toHaveBeenCalledWith("Username was changed");
    });
  });

  it("handles login error correctly", async () => {
    const user = userEvent.setup();
    const errorMessage = "Username already exists";
    mockChangeUsernameMutation.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent("");

    await user.type(screen.getByLabelText(/username/i), "existing username");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockChangeUsernameMutation).toHaveBeenCalledWith({
        username: "existing username",
      });
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(screen.getByLabelText(/username/i)).toHaveFocus();
    });
  });

  it("disables button when field wasn't changed", async () => {
    renderComponent("username");
    const submitButton = screen.getByRole("button", { name: /confirm/i });
    expect(submitButton).toBeDisabled();
  });

  it("disables button while pending", async () => {
    const user = userEvent.setup();
    mockChangeUsernameMutation.mockImplementationOnce(() => new Promise(() => {}));
    renderComponent("");

    await user.type(screen.getByLabelText(/username/i), "testuser");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
