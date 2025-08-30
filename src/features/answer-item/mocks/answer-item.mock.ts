import { UserRole, type Answer } from "@/shared/types";
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

const mockChangeAnswer = jest.fn();
jest.mock("../query-options/create-update-answer-mutation-options", () => ({
  createUpdateAnswerMutationOptions: () => ({
    mutationKey: ["change-answer"],
    mutationFn: mockChangeAnswer,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

const setRemovedAnswerIdMock = jest.fn();

const mockAnswer: Answer = {
  id: 1,
  content: "content",
  isCorrect: false,
  user: {
    id: 1,
    username: "username",
    role: UserRole.USER,
  },
};

export { mockAuth, mockChangeAnswer, setRemovedAnswerIdMock, mockAnswer };
