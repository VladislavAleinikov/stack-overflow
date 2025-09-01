import { MarkType, type FCWithSkeleton, type Snippet } from "@/shared/types";
import { Skeleton } from "@mui/material";
import { CodeSnippet } from "@/entity/code-snippet/";
import {
  useIsFetching,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { cn } from "@/shared/utils";
import { SnippetRating } from "@/entity/snippet-rating";
import { createMarkSnippetMutationOptions } from "../query-options/create-mark-snippet-mutation-options";
import { createAuthQueryOptions } from "@/shared/query-options";

interface SnippetItemProps {
  snippet: Snippet;
  onOpenSnippetForm: () => void;
}

export const SnippetItem: FCWithSkeleton<SnippetItemProps> = ({
  snippet,
  onOpenSnippetForm,
}) => {
  const { id, code, language, marks, user: snippetAuthor } = snippet;
  const isFetchingUsers = useIsFetching({ queryKey: ["snippets"] });
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const { mutate: markSnippet, data } = useMutation(
    createMarkSnippetMutationOptions(id)
  );
  let status: MarkType | undefined = undefined;
  let rating = marks.reduce((acc, curr) => {
    if (authUser && curr.user.id === authUser.id) {
      status = curr.type;
    }
    acc += curr.type === MarkType.LIKE ? 1 : -1;
    return acc;
  }, 0);

  if (data) {
    if (data.data.mark === MarkType.LIKE) {
      rating += 1;
    } else {
      rating -= 1;
    }
    status = data.data.mark;
  }

  const onLike = () => {
    markSnippet(MarkType.LIKE);
  };
  const onDislike = () => {
    markSnippet(MarkType.DISLIKE);
  };

  return (
    <div
      className={cn(
        "w-full flex justify-center items-center space-x-4",
        isFetchingUsers && "opacity-50"
      )}
    >
      <SnippetRating
        rating={rating}
        onLike={onLike}
        onDislike={onDislike}
        status={status}
        disabled={!authUser}
      />
      <CodeSnippet
        author={snippetAuthor}
        snippetId={id}
        code={code}
        language={language}
        showLineNumbers={true}
        copyable={true}
        isThisAuthor={snippetAuthor.id === authUser?.id}
        onEdit={onOpenSnippetForm}
      />
    </div>
  );
};

SnippetItem.Skeleton = () => {
  return (
    <div className={cn("w-full flex justify-center items-center space-x-4")}>
      <SnippetRating.Skeleton />
      <Skeleton variant="rounded" className="w-full h-[300px]" />
    </div>
  );
};
