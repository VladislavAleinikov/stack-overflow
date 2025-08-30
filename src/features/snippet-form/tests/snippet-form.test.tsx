import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnippetForm } from "../ui/snippet-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";
import { UserRole, type Snippet, Languages } from "@/shared/types";

const mockUpdateSnippet = jest.fn();
jest.mock("../query-options/create-update-snippet-mutation-options", () => ({
  createUpdateSnippetMutationOptions: () => ({
    mutationKey: ["update-snippet"],
    mutationFn: mockUpdateSnippet,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

const mockDeleteSnippet = jest.fn();
jest.mock("../query-options/create-delete-snippet-mutation-options", () => ({
  createDeleteSnippetMutationOptions: () => ({
    mutationKey: ["delete-snippet"],
    mutationFn: mockDeleteSnippet,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

const mockAddSnippet = jest.fn();
jest.mock("../query-options/create-add-snippet-mutation-options", () => ({
  createAddSnippetMutationOptions: () => ({
    mutationKey: ["add-snippet"],
    mutationFn: mockAddSnippet,
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

const mockSnippet: Snippet = {
  id: 1,
  language: Languages.JavaScript,
  code: "const variable = 'some value';",
  user: {
    id: 1,
    username: "username",
    role: UserRole.USER,
  },
  marks: [],
  comments: [],
};

describe("SnippetForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (snippet?: Snippet, open = true) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
          <SnippetForm open={open} onClose={onCloseMock} snippet={snippet} />
      </QueryClientProvider>
    );
  };

  it("shuold not render when closed", () => {
    renderComponent(undefined, false);

    expect(screen.queryByTestId("dialog")).toBeNull();
  });

  it("should not render update and delete buttons when snippet not provided", () => {
    renderComponent(undefined);

    expect(screen.queryByText(/javascript/i)).toBeInTheDocument();
    expect(screen.getByTestId("code-input")).toBeInTheDocument();

    expect(screen.queryByTestId("add-button")).toBeInTheDocument();
    expect(screen.queryByTestId("update-button")).toBeNull();
    expect(screen.queryByTestId("delete-button")).toBeNull();
  });

  it("should not render add button when snippet provided", async () => {
    renderComponent(mockSnippet);

    expect(screen.queryByText(mockSnippet.language)).toBeInTheDocument();

    expect(screen.queryByTestId("add-button")).toBeNull();
    expect(screen.queryByTestId("update-button")).toBeInTheDocument();
    expect(screen.queryByTestId("delete-button")).toBeInTheDocument();
  });

  it("should show alert dialog when delete click", async () => {
    const user = userEvent.setup();
    renderComponent(mockSnippet);

    await user.click(screen.getByTestId("delete-button"));

    expect(
      screen.getByText("Are you shure you want to delete this snippet?")
    ).toBeInTheDocument();
  });

  it("update button should be disabled when nothing changed", async () => {
    renderComponent(mockSnippet);
    expect(screen.getByTestId("update-button")).toBeDisabled();
  });

  it("add button should be disabled when fields are empty", async () => {
    renderComponent();
    expect(screen.getByTestId("add-button")).toBeDisabled();
  });

  it("should handle delete snippet correctly", async () => {
    const user = userEvent.setup();
    const message = "Snipped was deleted";
    mockDeleteSnippet.mockResolvedValueOnce({ message });
    renderComponent(mockSnippet);

    await user.click(screen.getByTestId("delete-button"));
    await user.click(await screen.findByText("Confirm"));

    await waitFor(() => {
      expect(mockDeleteSnippet).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(message);
    });
      expect(onCloseMock).toHaveBeenCalled();
  });

  it("should handle delete snippet error correctly", async () => {
    const user = userEvent.setup();
    const message = "Something went wrong";
    mockDeleteSnippet.mockRejectedValueOnce(new Error(message));
    renderComponent(mockSnippet);

    await user.click(screen.getByTestId("delete-button"));
    await user.click(await screen.findByText("Confirm"));

    await waitFor(() => {
      expect(mockDeleteSnippet).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(message);
    });
  });

  it("should handle update snippet correctly", async () => {
    const user = userEvent.setup();
    const message = "snippet was updated";
    mockUpdateSnippet.mockResolvedValueOnce({ message });
    renderComponent(mockSnippet);

    await user.click(screen.getByText(/javascript/i));
    await user.click(screen.getByText(/ruby/i));
    await user.click(screen.getByTestId("update-button"));

    await waitFor(() => {
      expect(mockUpdateSnippet).toHaveBeenCalledWith({
        code: mockSnippet.code,
        language: Languages.Ruby,
      });
      expect(toast.success).toHaveBeenCalledWith(message);
      expect(onCloseMock).toHaveBeenCalled();
    });
    
  });

  it("should handle update snippet error correctly", async () => {
    const user = userEvent.setup();
    const message = "Something went wrong";
    mockUpdateSnippet.mockRejectedValueOnce(new Error(message));
    renderComponent(mockSnippet);

    await user.click(screen.getByText(/javascript/i));
    await user.click(screen.getByText(/ruby/i));
    await user.click(screen.getByTestId("update-button"));

    await waitFor(() => {
      expect(mockUpdateSnippet).toHaveBeenCalledWith({
        code: mockSnippet.code,
        language: Languages.Ruby,
      });
      expect(toast.error).toHaveBeenCalledWith(message);
    });
  });

  // it("should handle add snippet correctly", async () => {
  //   const user = userEvent.setup();
  //   const message = "snippet was added";
  //   mockAddSnippet.mockResolvedValueOnce({ message });
  //   renderComponent();

  //   await user.click(screen.getByTestId("code-input"));
  //   await user.keyboard("aaa");
  //   await user.click(screen.getByTestId("add-button"));

  //   await waitFor(() => {
  //     expect(mockAddSnippet).toHaveBeenCalledWith({
  //       code: "aaa",
  //       language: Languages.JavaScript,
  //     });
  //     expect(toast.success).toHaveBeenCalledWith(message);
  //     expect(onCloseMock).toHaveBeenCalled();
  //   });
  // });

  // it("should handle update snippet error correctly", async () => {
  //   const user = userEvent.setup();
  //   const message = "Something went wrong";
  //   mockAddSnippet.mockRejectedValueOnce(new Error(message));
  //   renderComponent();

  //   await user.click(screen.getByTestId("code-input"));
  //   console.log(screen.getByTestId("code-input"));
    
  //   await user.keyboard(mockSnippet.code);
  //   await user.click(screen.getByTestId("add-button"));

  //   await waitFor(() => {
  //     expect(mockAddSnippet).toHaveBeenCalledWith({
  //       code: mockSnippet.code,
  //       language: Languages.Ruby,
  //     });
  //     expect(toast.error).toHaveBeenCalledWith(message);
  //   });
  // });
});
