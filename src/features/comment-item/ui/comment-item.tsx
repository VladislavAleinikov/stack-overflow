import { createAuthQueryOptions } from "@/shared/query-options";
import type { Comment, FCWithSkeleton } from "@/shared/types";
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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createUpdateCommentMutationOptions } from "../query-options/create-update-comment-mutation-options";
import { NavLink } from "react-router";
import DeleteIcon from "@mui/icons-material/Delete";

interface CommentItemProps {
  comment: Comment;
  setRemovedCommentId: (id: number) => void;
}

export const CommentItem: FCWithSkeleton<CommentItemProps> = ({
  comment: { id, content, user },
  setRemovedCommentId,
}) => {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const { mutateAsync: updateComment } = useMutation(
    createUpdateCommentMutationOptions(id)
  );
  const queryClient = useQueryClient();
  const isAuthUserAuthor = user.id === authUser?.id;

  const onTextareaSubmit = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    setIsEditing(false);

    if (!e.target.value) {
      toast.error("Comment cant be empty.");
      return;
    } else if (e.target.value === content) {
      return;
    }

    updateComment(e.target.value)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["snippet"] });
      })
      .catch(() => {});
  };
  
    useEffect(() => {
      if (isEditing && contentRef.current) {
        contentRef.current.focus();
        contentRef.current.selectionStart = contentRef.current.selectionEnd =
          contentRef.current.value.length;
      }
    }, [isEditing]);

  return (
    <>
      <Divider />
      <div className="w-full space-y-2">
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
            <IconButton
              onClick={() => setRemovedCommentId(id)}
              color="error"
              data-testid="delete-button"
            >
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
              data-testid="content-textarea"
            />
          ) : (
            <Button
              variant="text"
              onClick={() => setIsEditing(true)}
              className="normal-case whitespace-pre-line w-full mt-1 px-3 py-1 justify-start text-start text-[1rem] font-normal"
              data-testid="content-button"
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
    </>
  );
};

CommentItem.Skeleton = () => {
  return (
    <>
      <Divider className="my-4" />
      <div className="flex items-center w-min space-x-2 group">
        <Skeleton variant="circular" className="w-8 h-8" />
        <Skeleton variant="rounded" className="w-[100px] h-[28px]" />
      </div>
      <Skeleton variant="rounded" className="w-full h-[120px]" />
    </>
  );
};
