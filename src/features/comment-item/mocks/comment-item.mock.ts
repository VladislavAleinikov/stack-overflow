import { UserRole, type Comment } from "@/shared/types";
import { toast } from "sonner";

const mockAuth = jest.fn().mockResolvedValue({
  id: 1,
  username: "username",
  role: UserRole.USER,
});
jest.mock("@/shared/query-options", () => ({
  createAuthQueryOptions: jest.fn(() => ({
    queryKey: ["auth"],
    queryFn: mockAuth,
  })),
}));

const mockUpdateComment = jest.fn();
jest.mock("../query-options/create-update-comment-mutation-options", () => ({
  createUpdateCommentMutationOptions: () => ({
    mutationKey: ["update-comment"],
    mutationFn: mockUpdateComment,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

const setRemovedCommentIdMock = jest.fn();

const mockComment: Comment = {
  id: 1,
  content: "content",
  user: {
    id: 1,
    username: "username",
    role: UserRole.USER,
  },
};

export { mockAuth, mockUpdateComment, setRemovedCommentIdMock, mockComment };
