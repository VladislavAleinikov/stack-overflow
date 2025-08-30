import "../mocks/change-password-form.mock";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChangePasswordForm } from "../ui/change-password-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";
import { mockChangePasswordMutation } from "../mocks/change-password-form.mock";

describe("ChangePasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ChangePasswordForm />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it("renders form elements correctly", () => {
    renderComponent();

    expect(screen.getByText("Change password")).toBeInTheDocument();
    expect(screen.getByLabelText("Old password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/old password required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be at least 6 characters long/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/confirmation required/i)
    ).toBeInTheDocument();
  });

  it("shows validation errors when password is long", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByLabelText("New password"),
      "veryLongPassword123456789"
    );
    const submitButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/max password length is 16 characters/i)
    ).toBeInTheDocument();
  });

  it("shows validation errors when password is weak", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText("New password"), "WeakPassword");
    const submitButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(
        /password must contain at least one lowercase letter, one uppercase letter, one number and one symbol/i
      )
    ).toBeInTheDocument();
  });

  it("shows error when password was not confirmed", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText("Old password"), "oldPassword");
    const newPassword = screen.getByLabelText("New password");
    await user.type(newPassword, "Password123$");
    const confirmPassword = screen.getByLabelText("Confirm password");
    await user.type(confirmPassword, "password321");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(
      await screen.findByText(/Passwords should be same/i)
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockChangePasswordMutation).not.toHaveBeenCalled();
    });
  });

  it("shows error when new password is equal to old", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText("Old password"), "Password123$");
    const newPassword = screen.getByLabelText("New password");
    await user.type(newPassword, "Password123$");
    const confirmPassword = screen.getByLabelText("Confirm password");
    await user.type(confirmPassword, "Password123$");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(
      await screen.findByText(
        /new password must be different from the old one/i
      )
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockChangePasswordMutation).not.toHaveBeenCalled();
    });
  });

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup();
    mockChangePasswordMutation.mockResolvedValueOnce({
      message: "Changed password successfully",
    });
    renderComponent();

    await user.type(screen.getByLabelText("Old password"), "oldPassword");
    await user.type(screen.getByLabelText("New password"), "Password123$");
    await user.type(screen.getByLabelText("Confirm password"), "Password123$");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockChangePasswordMutation).toHaveBeenCalledWith({
        oldPassword: "oldPassword",
        newPassword: "Password123$",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Changed password successfully"
      );
    });
  });

  it("handles register error correctly", async () => {
    const user = userEvent.setup();
    const errorMessage = "Wrong password";
    mockChangePasswordMutation.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent();

    const oldPassword = screen.getByLabelText("Old password");
    await user.type(oldPassword, "wrongPassword");
    await user.type(screen.getByLabelText("New password"), "Password123$");
    await user.type(screen.getByLabelText("Confirm password"), "Password123$");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockChangePasswordMutation).toHaveBeenCalledWith({
        oldPassword: "wrongPassword",
        newPassword: "Password123$",
      });
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(oldPassword).toHaveFocus();
    });
  });

  it("disables button while pending", async () => {
    const user = userEvent.setup();
    mockChangePasswordMutation.mockImplementationOnce(
      () => new Promise(() => {})
    );
    renderComponent();

    await user.type(screen.getByLabelText("Old password"), "oldPassword");
    await user.type(screen.getByLabelText("New password"), "Password123$");
    await user.type(screen.getByLabelText("Confirm password"), "Password123$");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
