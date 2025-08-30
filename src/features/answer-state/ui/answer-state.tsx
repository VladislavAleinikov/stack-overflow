import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSetAnswerStateMutatioinOptions } from "../query-options/create-set-answer-state-mutation-options";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { cn } from "@/shared/utils";
import type { AnswerState as AnswerStateType } from "../types";

interface AnswerStateProps {
  answerId: number;
  isCorrect: boolean;
  isAuthUserQuestionAuthor: boolean;
}

export const AnswerState: React.FC<AnswerStateProps> = ({
  answerId,
  isCorrect,
  isAuthUserQuestionAuthor,
}) => {
  const { mutateAsync: setAnswerState, isPending } = useMutation(
    createSetAnswerStateMutatioinOptions(answerId)
  );
  const queryClient = useQueryClient();

  const onUpdateState = (newState: AnswerStateType) => {
    setAnswerState(newState).then(() => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
    }).catch(() => { });
  };

  if (!isAuthUserQuestionAuthor) {
    return (
      <div
        className={cn(
          "rounded-full border border-error",
          isCorrect && "border-success"
        )}
      >
        {isCorrect ? (
          <CheckIcon
            data-testid="check-icon"
            className="p-2 w-10 h-10 fill-success"
          />
        ) : (
          <CloseIcon
            data-testid="cross-icon"
            className="p-2 w-10 h-10 fill-error"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      <Button
        variant="outlined"
        className={cn(
          "rounded-full p-0 min-w-min border-primary",
          isCorrect && "border-success"
        )}
        onClick={() => onUpdateState("correct")}
        disabled={isPending || isCorrect}
        data-testid="correct-button"
      >
        <CheckIcon
          className={cn(
            "p-2 w-10 h-10 fill-primary",
            isCorrect && "fill-success"
          )}
        />
      </Button>
      <Button
        variant="outlined"
        className={cn(
          "rounded-full p-0 min-w-min border-primary",
          !isCorrect && "border-error"
        )}
        onClick={() => onUpdateState("incorrect")}
        disabled={isPending || !isCorrect}
        data-testid="incorrect-button"
      >
        <CloseIcon
          className={cn(
            "p-2 w-10 h-10 fill-primary",
            !isCorrect && "fill-error"
          )}
        />
      </Button>
    </div>
  );
};
