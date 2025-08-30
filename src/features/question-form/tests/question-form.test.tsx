import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionForm } from "../ui/question-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserRole, type Question } from "@/shared/types";

const mockUpdateuestion = jest.fn();
jest.mock("../query-options/create-update-question-mutation-options", () => ({
  createUpdateQuestionMutationOptions: () => ({
    mutationKey: ["update-question"],
    mutationFn: mockUpdateuestion,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

const mockDeleteQuestion = jest.fn();
jest.mock("../query-options/create-delete-question-mutation-options", () => ({
  createDeleteQuestionMutationOptions: () => ({
    mutationKey: ["delete-question"],
    mutationFn: mockDeleteQuestion,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

const mockAddQuestion = jest.fn();
jest.mock("../query-options/create-add-question-mutation-options", () => ({
  createAddQuestionMutationOptions: () => ({
    mutationKey: ["add-question"],
    mutationFn: mockAddQuestion,
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

const onCloseMock = jest.fn();

const mockQuestion: Question = {
  id: 1,
  title: "some title",
  description: "some descriptioin",
  attachedCode: "const variable = 'some value';",
  isResolved: false,
  user: {
    id: 1,
    username: "username",
    role: UserRole.USER,
  },
  answers: [],
};

describe("SnippetForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (question?: Question, open = true) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <QuestionForm open={open} onClose={onCloseMock} question={question} />
      </QueryClientProvider>
    );
  };

  it("shuold not render when closed", () => {
    renderComponent(undefined, false);

    expect(screen.queryByTestId("dialog")).toBeNull();
  });

  it("should not render update and delete buttons when question not provided", () => {
    renderComponent(undefined);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByTestId("code-input")).toBeInTheDocument();

    expect(screen.queryByTestId("add-button")).toBeInTheDocument();
    expect(screen.queryByTestId("update-button")).toBeNull();
    expect(screen.queryByTestId("delete-button")).toBeNull();
  });

  it("should not render add button when question provided", async () => {
    renderComponent(mockQuestion);

    expect(screen.getByLabelText(/title/i)).toHaveValue(mockQuestion.title);
    expect(screen.getByLabelText("Description")).toHaveValue(
      mockQuestion.description
    );

    expect(screen.queryByTestId("add-button")).toBeNull();
    expect(screen.queryByTestId("update-button")).toBeInTheDocument();
    expect(screen.queryByTestId("delete-button")).toBeInTheDocument();
  });

  it("should show alert dialog when delete click", async () => {
    const user = userEvent.setup();
    renderComponent(mockQuestion);

    await user.click(screen.getByTestId("delete-button"));

    expect(
      screen.getByText("Are you shure you want to delete this question?")
    ).toBeInTheDocument();
  });

  it("update button should be disabled when nothing changed", async () => {
    renderComponent(mockQuestion);
    expect(screen.getByTestId("update-button")).toBeDisabled();
  });

  it("add button should be disabled when fields are empty", async () => {
    renderComponent();
    expect(screen.getByTestId("add-button")).toBeDisabled();
  });

  it("should handle delete snippet correctly", async () => {
    const user = userEvent.setup();
    const message = "Snipped was deleted";
    mockDeleteQuestion.mockResolvedValueOnce({ message });
    renderComponent(mockQuestion);

    await user.click(screen.getByTestId("delete-button"));
    await user.click(await screen.findByText("Confirm"));

    await waitFor(() => {
      expect(mockDeleteQuestion).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(message);
    });
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should handle delete snippet error correctly", async () => {
    const user = userEvent.setup();
    const message = "Something went wrong";
    mockDeleteQuestion.mockRejectedValueOnce(new Error(message));
    renderComponent(mockQuestion);

    await user.click(screen.getByTestId("delete-button"));
    await user.click(await screen.findByText("Confirm"));

    await waitFor(() => {
      expect(mockDeleteQuestion).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(message);
    });
  });

  it("should handle update question correctly", async () => {
    const user = userEvent.setup();
    const message = "question was updated";
    mockUpdateuestion.mockResolvedValueOnce({ message });
    renderComponent(mockQuestion);

    const title = screen.getByLabelText(/title/i);
    await user.clear(title);
    await user.type(title, "new title");
    const description = screen.getByLabelText("Description");
    await user.clear(description);
    await user.type(description, "new descripition");
    await user.click(screen.getByTestId("update-button"));

    await waitFor(() => {
      expect(mockUpdateuestion).toHaveBeenCalledWith({
        title: "new title",
        description: "new descripition",
        attachedCode: mockQuestion.attachedCode,
      });
      expect(toast.success).toHaveBeenCalledWith(message);
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("should handle update question error correctly", async () => {
    const user = userEvent.setup();
    const message = "Something went wrong";
    mockUpdateuestion.mockRejectedValueOnce(new Error(message));
    renderComponent(mockQuestion);

    const title = screen.getByLabelText(/title/i);
    await user.clear(await screen.findByLabelText(/title/i));
    await user.type(await screen.findByLabelText(/title/i), "new title");
    const description = screen.getByLabelText("Description");
    await user.clear(description);
    await user.type(description, "new descripition");
    await user.click(screen.getByTestId("update-button"));

    await waitFor(() => {
      expect 
      expect(mockUpdateuestion).toHaveBeenCalledWith({
        title: "new title",
        description: "new descripition",
        attachedCode: mockQuestion.attachedCode,
      });
      expect(toast.error).toHaveBeenCalledWith(message);
    });
  });

  // it("should handle add question correctly", async () => {
  //   const user = userEvent.setup();
  //   const message = "question was added";
  //   mockAddQuestion.mockResolvedValueOnce({ message });
  //   renderComponent();

  //   await user.click(screen.getByTestId("code-input"));
  //   await user.keyboard("aaa");
  //   await user.click(screen.getByTestId("add-button"));

  //   await waitFor(() => {
  //     expect(mockAddQuestion).toHaveBeenCalledWith({
  //       code: "aaa",
  //       language: Languages.JavaScript,
  //     });
  //     expect(toast.success).toHaveBeenCalledWith(message);
  //     expect(onCloseMock).toHaveBeenCalled();
  //   });
  // });

  // it("should handle update question error correctly", async () => {
  //   const user = userEvent.setup();
  //   const message = "Something went wrong";
  //   mockAddQuestion.mockRejectedValueOnce(new Error(message));
  //   renderComponent();

  //   await user.click(screen.getByTestId("code-input"));
  //   console.log(screen.getByTestId("code-input"));

  //   await user.keyboard(mockQuestion.code);
  //   await user.click(screen.getByTestId("add-button"));

  //   await waitFor(() => {
  //     expect(mockAddQuestion).toHaveBeenCalledWith({
  //       code: mockQuestion.code,
  //       language: Languages.Ruby,
  //     });
  //     expect(toast.error).toHaveBeenCalledWith(message);
  //   });
  // });
});
