import type { Comment, FCWithSkeleton } from "@/shared/types";
import { ContentForm } from "@/features/content-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createAddCommentMutationOptions } from "../query-options/create-add-comment-mutation-options";
import { CommentItem } from "@/features/comment-item";
import { AlertDialog } from "@/shared/ui/alert-dialog";
import { useState } from "react";
import { createDeleteCommentMutationOptions } from "../query-options/create-delete-comment-mutation-options";
import { Divider } from "@mui/material";
import { createAuthQueryOptions } from "@/shared/query-options";

interface CommentsListProps {
  snippetId: number;
  comments: Comment[];
}

export const CommentsList: FCWithSkeleton<CommentsListProps> = ({
  snippetId,
  comments,
}) => {
  const [removedCommentId, setRemovedCommentId] = useState<number | null>(null);
  const { mutateAsync: addComment, isPending } = useMutation(
    createAddCommentMutationOptions()
  );
  const { mutateAsync: deleteComment } = useMutation(
    createDeleteCommentMutationOptions()
  );
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const queryClient = useQueryClient();

  const onAddComment = ({ content }: { content: string }) => {
    addComment({ snippetId, content }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["snippet"],
      });
    });
  };

  const onDeleteComment = () => {
    deleteComment(removedCommentId!).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["snippet"],
      });
      setRemovedCommentId(null);
    });
  };

  return (
    <div className="space-y-4">
      {authUser !== null ? (
        <ContentForm
          title="comment"
          onSubmit={onAddComment}
          isDisabled={isPending}
        />
      ) : (
        <h4 className="uppercase tracking-widest text-3xl">Comments</h4>
      )}
      {!comments.length && (
        <>
          <Divider />
          <span className="block text-center text-lg">No comments yet</span>
        </>
      )}
      {comments.map((comment) => (
        <CommentItem
          comment={comment}
          setRemovedCommentId={setRemovedCommentId}
          key={comment.id}
        />
      ))}
      <AlertDialog
        title="Are you shure you want to delete your comment?"
        text="This action can't be canceled"
        open={!!removedCommentId}
        onClose={() => setRemovedCommentId(null)}
        onConfirm={onDeleteComment}
      />
    </div>
  );
};

CommentsList.Skeleton = () => {
  return (
    <div>
      <ContentForm.Skeleton />
      <CommentItem.Skeleton />
      <CommentItem.Skeleton />
    </div>
  );
};
