import "../mocks/comment-item.mock";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentItem } from "../ui/comment-item";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";
import { UserRole } from "@/shared/types";
import {
  mockAuth,
  mockUpdateComment,
  setRemovedCommentIdMock,
  mockComment,
} from "../mocks/comment-item.mock";

describe("CommentItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = async () => {
    const queryClient = new QueryClient();
    return await act(async () =>
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <CommentItem
              comment={mockComment}
              setRemovedCommentId={setRemovedCommentIdMock}
            />
          </BrowserRouter>
        </QueryClientProvider>
      )
    );
  };

  it("renders elements correctly if user is not author", async () => {
    mockAuth.mockResolvedValueOnce({
      id: 2,
      username: "username",
      role: UserRole.USER,
    });
    await renderComponent();

    expect(screen.queryByTestId("content-button")).toBeNull();
    expect(screen.queryByTestId("delete-button")).toBeNull();
    expect(screen.getByText(mockComment.content)).toBeInTheDocument();
    expect(screen.getByText(mockComment.user.username)).toBeInTheDocument();
  });

  it("renders elements correctly if user is author", async () => {
    renderComponent();

    expect(await screen.findByTestId("content-button")).toBeInTheDocument();
    expect(await screen.findByTestId("delete-button")).toBeInTheDocument();
  });

  it("render textarea after content button click", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.click(await screen.findByTestId("content-button"));

    expect(await screen.findByTestId("content-textarea")).toBeInTheDocument();
    expect(screen.queryByTestId("content-button")).toBeNull();
  });

  it("render button after content textarea blur", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.click(await screen.findByTestId("content-button"));

    expect(await screen.findByTestId("content-textarea")).toBeInTheDocument();
    expect(screen.queryByTestId("content-button")).toBeNull();

    await user.click(document.body);

    expect(screen.queryByTestId("content-textarea")).toBeNull();
    expect(await screen.findByTestId("content-button")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockUpdateComment).not.toHaveBeenCalled();
    });
  });

  it("handle remove button click correctly", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.click(await screen.findByTestId("delete-button"));

    expect(setRemovedCommentIdMock).toHaveBeenCalledWith(mockComment.id);
  });

  it("handle submit textarea correctly", async () => {
    const user = userEvent.setup();
    const successMessage = "Answer updated";
    mockUpdateComment.mockResolvedValueOnce({ message: successMessage });
    await renderComponent();

    await user.click(await screen.findByTestId("content-button"));
    await user.type(await screen.findByText(mockComment.content), "some text");
    await user.click(document.body);

    await waitFor(() => {
      expect(mockUpdateComment).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(successMessage);
    });
    expect(await screen.findByTestId("content-button")).toBeInTheDocument();
  });

  it("handle error if textarea is empty", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.click(await screen.findByTestId("content-button"));
    await user.clear(await screen.findByText(mockComment.content));
    await user.click(document.body);

    await waitFor(() => {
      expect(mockUpdateComment).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Comment cant be empty.");
    });
  });

  it("handles comment change error correctly", async () => {
    const user = userEvent.setup();
    const errorMessage = "Something went wrong";
    mockUpdateComment.mockRejectedValueOnce(new Error(errorMessage));
    await renderComponent();

    await user.click(await screen.findByTestId("content-button"));
    await user.type(await screen.findByText(mockComment.content), "some text");
    await user.click(document.body);

    await waitFor(() => {
      expect(mockUpdateComment).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
