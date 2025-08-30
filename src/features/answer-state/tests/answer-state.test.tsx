import "../mocks/answer-state.mock";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnswerState } from "../ui/answer-state";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { mockSetAnswerStatusMutation } from "../mocks/answer-state.mock";

describe("AnswerState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (
    isCorrect = true,
    isAuthUserQuestionAuthor = true
  ) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <AnswerState
          answerId={1}
          isCorrect={isCorrect}
          isAuthUserQuestionAuthor={isAuthUserQuestionAuthor}
        />
      </QueryClientProvider>
    );
  };

  it("renders no buttons if user is not question author", () => {
    renderComponent(true, false);

    expect(screen.queryByTestId("correct-button")).toBeNull();
    expect(screen.queryByTestId("incorrect-button")).toBeNull();
  });

  it("renders correctly with isCorrect prop and user not question author", () => {
    renderComponent(true, false);

    expect(screen.queryByTestId("check-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("cross-icon")).toBeNull();
  });

  it("renders correctly with false isCorrect prop and user not question author", () => {
    renderComponent(false, false);

    expect(screen.queryByTestId("cross-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("check-icon")).toBeNull();
  });

  it("incorrect button shoud be disabled if isCorrect is false", async () => {
    renderComponent(false);
    expect(await screen.findByTestId("incorrect-button")).toBeDisabled();
  });

  it("correct button shoud be disabled if isCorrect is true", async () => {
    renderComponent();
    expect(await screen.findByTestId("correct-button")).toBeDisabled();
  });

  it("submits correct state successfully", async () => {
    const user = userEvent.setup();
    const successMessage = "state was updated";
    mockSetAnswerStatusMutation.mockResolvedValueOnce({
      message: successMessage,
    });
    renderComponent(false);

    await user.click(await screen.findByTestId("correct-button"));

    await waitFor(() => {
      expect(mockSetAnswerStatusMutation).toHaveBeenCalledWith("correct");
      expect(toast.success).toHaveBeenCalledWith(successMessage);
    });
  });

  it("submits incorrect state successfully", async () => {
    const user = userEvent.setup();
    const successMessage = "state was updated";
    mockSetAnswerStatusMutation.mockResolvedValueOnce({
      message: successMessage,
    });
    renderComponent();

    await user.click(await screen.findByTestId("incorrect-button"));

    await waitFor(() => {
      expect(mockSetAnswerStatusMutation).toHaveBeenCalledWith("incorrect");
      expect(toast.success).toHaveBeenCalledWith(successMessage);
    });
  });

  it("handles error correctly", async () => {
    const user = userEvent.setup();
    const errorMessage = "something went wrong";
    mockSetAnswerStatusMutation.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent();

    await user.click(await screen.findByTestId("incorrect-button"));

    await waitFor(() => {
      expect(mockSetAnswerStatusMutation).toHaveBeenCalledWith("incorrect");
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("buttons shoud be disabled while pending", async () => {
    const user = userEvent.setup();
    mockSetAnswerStatusMutation.mockImplementationOnce(
      () => new Promise(() => {})
    ); // Never resolving promise
    renderComponent();

    await user.click(await screen.findByTestId("incorrect-button"));

    expect(await screen.findByTestId("correct-button")).toBeDisabled();
    expect(await screen.findByTestId("incorrect-button")).toBeDisabled();
  });
});
