import { Languages, UserRole, type Snippet } from "@/shared/types";
import { toast } from "sonner";

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

export { mockAddSnippet, mockUpdateSnippet, mockDeleteSnippet, mockSnippet, onCloseMock};