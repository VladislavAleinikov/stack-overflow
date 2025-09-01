import "../mocks/account-menu.mock";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountMenu } from "../ui/account-menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";
import {
  mockLogoutMutation,
  navigateMock,
  currentUserMock,
} from "../mocks/account-menu.mock";

describe("AccountMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AccountMenu user={currentUserMock} />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it("dont render elements inside menu", () => {
    renderComponent();

    expect(screen.getByText(currentUserMock.username)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("render elements inside menu after click", async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByText(currentUserMock.username)).toBeInTheDocument();
    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);

    expect(await screen.findByText(/settings/i)).toBeInTheDocument();
    expect(await screen.findByText(/logout/i)).toBeInTheDocument();
  });

  it("navigate to user page after settings click", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText(/settings/i));

    expect(navigateMock).toHaveBeenCalledWith("/users/me");
  });

  it("logout without errors", async () => {
    const user = userEvent.setup();
    const successMessage = "Logout successfully";
    mockLogoutMutation.mockResolvedValueOnce({ message: successMessage });
    renderComponent();

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText(/logout/i));

    await waitFor(() => {
      expect(mockLogoutMutation).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith("/");
      expect(toast.success).toHaveBeenCalledWith(successMessage);
    });
  });

  it("handles logout error correctly", async () => {
    const user = userEvent.setup();
    const errorMessage = "Something went wrong";
    mockLogoutMutation.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent();

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText(/logout/i));

    await waitFor(() => {
      expect(mockLogoutMutation).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
