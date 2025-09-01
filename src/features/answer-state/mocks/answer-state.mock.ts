import { toast } from "sonner";

const mockSetAnswerStatusMutation = jest.fn();
jest.mock("../query-options/create-set-answer-state-mutation-options", () => ({
  createSetAnswerStateMutatioinOptions: () => ({
    mutationKey: ["set-status"],
    mutationFn: mockSetAnswerStatusMutation,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  }),
}));

export { mockSetAnswerStatusMutation };