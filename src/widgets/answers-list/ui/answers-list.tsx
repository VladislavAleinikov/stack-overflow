import { AnswerItem } from "@/features/answer-item";
import type { Answer, FCWithSkeleton } from "@/shared/types";
import { ContentForm } from "@/features/content-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddAnswerMutationOptions } from "../query-options/create-add-answer-mutation-options";
import { Divider } from "@mui/material";
import { createDeleteAnswerMutationOptions } from "../query-options/create-delete-answer-mutation-options";
import { AlertDialog } from "@/shared/ui/alert-dialog";
import { useState } from "react";

interface AnswersListProps {
  questionId: number;
  answers: Answer[];
  isAuthUserQuestionAuthor: boolean;
}

export const AnswersList: FCWithSkeleton<AnswersListProps> = ({
  questionId,
  answers,
  isAuthUserQuestionAuthor,
}) => {
  const [removedAnswerId, setRemovedAnswerId] = useState<number | null>(null);
  const { mutateAsync: addAnswer, isPending } = useMutation(
    createAddAnswerMutationOptions()
  );
  const { mutateAsync: deleteAnswer } = useMutation(
    createDeleteAnswerMutationOptions()
  );
  const queryClient = useQueryClient();

  const onAddAnswer = ({ content }: { content: string }) => {
    addAnswer({ questionId, content }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["question"],
      });
    });
  };

  const onDeleteAnswer = () => {
    deleteAnswer(removedAnswerId!).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["question"],
      });
      setRemovedAnswerId(null);
    });
  };

  return (
    <div className="space-y-4">
      <ContentForm
        title="answer"
        onSubmit={onAddAnswer}
        isDisabled={isPending}
      />
      {!answers.length && (
        <>
          <Divider />
          <span className="block text-center text-lg">No answers yet</span>
        </>
      )}
      {answers.map((answer) => (
        <AnswerItem
          answer={answer}
          isAuthUserQuestionAuthor={isAuthUserQuestionAuthor}
          setRemovedAnswerId={setRemovedAnswerId}
          key={answer.id}
        />
      ))}
      <AlertDialog
        title="Are you shure you want to delete your answer?"
        text="This action can't be canceled"
        open={!!removedAnswerId}
        onClose={() => setRemovedAnswerId(null)}
        onConfirm={onDeleteAnswer}
      />
    </div>
  );
};

AnswersList.Skeleton = () => {
  return (
    <div>
      <ContentForm.Skeleton />
      <AnswerItem.Skeleton />
      <AnswerItem.Skeleton />
    </div>
  );
};
