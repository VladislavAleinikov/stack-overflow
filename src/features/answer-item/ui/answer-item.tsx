import { AnswerState } from "@/features/answer-state";
import { createAuthQueryOptions } from "@/shared/query-options";
import type { Answer, FCWithSkeleton } from "@/shared/types";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Skeleton,
  TextField,
} from "@mui/material";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createUpdateAnswerMutationOptions } from "../query-options/create-update-answer-mutation-options";
import { NavLink } from "react-router";import DeleteIcon from "@mui/icons-material/Delete";

interface AnswerItemProps {
  answer: Answer;
  isAuthUserQuestionAuthor: boolean;
  setRemovedAnswerId: (id: number) => void;
}

export const AnswerItem: FCWithSkeleton<AnswerItemProps> = ({
  answer: { id, content, isCorrect, user },
  isAuthUserQuestionAuthor,
  setRemovedAnswerId,
}) => {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const { mutateAsync: updateAnswer } = useMutation(
    createUpdateAnswerMutationOptions(id)
  );
  const queryClient = useQueryClient();
  const isAuthUserAuthor = user.id === authUser?.id;

  const onStartEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.selectionStart = contentRef.current.selectionEnd =
          contentRef.current.value.length;
      }
    });
  };

  const onTextareaSubmit = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    setIsEditing(false);

    if (!e.target.value) {
      toast.error("Answer cant be empty.");
      return;
    } else if (e.target.value === content) {
      return;
    }

    updateAnswer(e.target.value).then(() => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
    });
  };

  return (
    <>
      <Divider className="my-4" />
      <div className="flex items-start space-x-4">
        <AnswerState
          answerId={id}
          isCorrect={isCorrect}
          isAuthUserQuestionAuthor={isAuthUserQuestionAuthor}
        />
        <div className="w-full">
          <div className="flex space-x-4">
            <NavLink
              to={`/users/${user.id}`}
              className="flex items-center w-min space-x-2 group"
            >
              <Avatar className="w-8 h-8 text-xl">{user.username[0]}</Avatar>
              <span className="text-lg group-hover:underline">
                {user.username}
              </span>
            </NavLink>
            {isAuthUserAuthor && (
              <IconButton onClick={() => setRemovedAnswerId(id)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </div>
          {isAuthUserAuthor ? (
            isEditing ? (
              <TextField
                inputRef={contentRef}
                defaultValue={content}
                multiline
                fullWidth
                onBlur={onTextareaSubmit}
                size="small"
              />
            ) : (
              <Button
                variant="text"
                onClick={onStartEditing}
                className="normal-case whitespace-pre-line w-full mt-1 px-3 py-1 justify-start text-start text-[1rem] font-normal"
              >
                {content}
              </Button>
            )
          ) : (
            <p className="whitespace-pre-line w-full mt-1 px-3 py-1 justify-start text-start text-[1rem] font-normal">
              {content}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

AnswerItem.Skeleton = () => {
  return (
    <>
      <Divider className="my-4" />
      <div className="flex items-start space-x-4">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="w-full">
          <div className="flex items-center w-min space-x-2 group">
            <Skeleton variant="circular" className="w-8 h-8" />
            <Skeleton variant="rounded" className="w-[100px] h-[28px]" />
          </div>
          <Skeleton variant="rounded" className="w-full h-[120px]" />
        </div>
      </div>
    </>
  );
};
