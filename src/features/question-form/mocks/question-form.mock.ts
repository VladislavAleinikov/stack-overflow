import { UserRole, type Question } from "@/shared/types";
import { toast } from "sonner";

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

export {
  mockAddQuestion,
  mockUpdateuestion,
  mockDeleteQuestion,
  mockQuestion,
  onCloseMock,
};
