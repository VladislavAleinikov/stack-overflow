import "../mocks/register-form.mock";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "../ui/register-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";
import {
  mockRegisterMutation,
  navigateMock,
} from "../mocks/register-form.mock";

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it("renders form elements correctly", () => {
    renderComponent();

    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/)).toBeInTheDocument();
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
      screen.getByLabelText("Password"),
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

    await user.type(screen.getByLabelText("Password"), "WeakPassword");
    await user.type(screen.getByLabelText("Confirm password"), "WeakPassword");
    const submitButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(
        /password must contain at least one lowercase letter, one uppercase letter, one number and one symbol/i
      )
    ).toBeInTheDocument();
  });

  it("shows error when passwords are different", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText("Password"), "Password123$");
    const confirmPassword = screen.getByLabelText("Confirm password");
    await user.type(confirmPassword, "password321");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(
      await screen.findByText(/Passwords should be same/i)
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockRegisterMutation).not.toHaveBeenCalled();
    });
    expect(confirmPassword).toHaveFocus();
  });

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup();
    mockRegisterMutation.mockResolvedValueOnce({
      message: "Sign up successfuly",
    });
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText("Password"), "Password123$");
    await user.type(screen.getByLabelText("Confirm password"), "Password123$");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockRegisterMutation).toHaveBeenCalledWith({
        username: "testuser",
        password: "Password123$",
      });
      expect(navigateMock).toHaveBeenCalledWith("/login");
      expect(toast.success).toHaveBeenCalledWith("Sign up successfuly");
    });
  });

  it("handles register error correctly", async () => {
    const user = userEvent.setup();
    const errorMessage = "Username exists";
    mockRegisterMutation.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent();

    const username = screen.getByLabelText(/username/i);
    await user.type(username, "existing");
    await user.type(screen.getByLabelText("Password"), "Password123$");
    await user.type(screen.getByLabelText("Confirm password"), "Password123$");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockRegisterMutation).toHaveBeenCalledWith({
        username: "existing",
        password: "Password123$",
      });
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(username).toHaveFocus();
    });
  });

  it("disables button while pending", async () => {
    const user = userEvent.setup();
    mockRegisterMutation.mockImplementationOnce(() => new Promise(() => {})); // Never resolving promise
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText("Password"), "Password123$");
    await user.type(screen.getByLabelText("Confirm password"), "Password123$");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
