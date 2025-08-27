import { type FCWithSkeleton } from "@/shared/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createSnippetQueryOptions } from "../query-options/create-snippet-query-options";
import { Button, Divider, Paper, Skeleton } from "@mui/material";
import { NavLink, useNavigate } from "react-router";
import { createAuthQueryOptions } from "@/shared/query-options";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { SnippetForm } from "@/features/snippet-form";
import { CommentsList } from "@/widgets/comments-list";
import { SnippetItem } from "@/features/snippet-item";

interface DetailedSnippetProps {
  snippetId: number;
}

export const DetailedSnippet: FCWithSkeleton<DetailedSnippetProps> = ({
  snippetId,
}) => {
  const [isSnippetFormOpen, setIsSnippetFormOpen] = useState<boolean>(false);
  const { data: snippet } = useSuspenseQuery(
    createSnippetQueryOptions(snippetId)
  );
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const navigate = useNavigate();

  if (snippet === null) {
    return (
      <Paper className="p-16 flex flex-col justify-center items-center space-y-4">
        <h1>404</h1>
        <h3>Snippet not found!</h3>
        <Button variant="contained" onClick={() => navigate("/")}>
          Return to home page
        </Button>
      </Paper>
    );
  }

  const { id, comments, user } = snippet;

  return (
    <Paper className="w-[80%] p-16 flex flex-col space-y-8">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="tracking-wider">
            Snippet by{" "}
            <NavLink to={`/users/${user.id}`} className="hover:underline">
              {user.username}
            </NavLink>
          </h3>
          {user.id === authUser?.id && (
            <>
              <Button
                variant="contained"
                onClick={() => setIsSnippetFormOpen(true)}
              >
                <EditIcon className="w-4 h-4 mr-2" />
                Edit snippet
              </Button>
              <SnippetForm
                open={isSnippetFormOpen}
                onClose={() => setIsSnippetFormOpen(false)}
                snippet={snippet}
              />
            </>
          )}
        </div>
        <SnippetItem
          snippet={snippet}
          onOpenSnippetForm={() => setIsSnippetFormOpen(true)}
        />
      </div>
      <Divider />
      <CommentsList snippetId={id} comments={comments} />
    </Paper>
  );
};

DetailedSnippet.Skeleton = () => {
  return (
    <Paper className="w-[80%] p-16 flex flex-col space-y-8">
      <div className="flex flex-col space-y-2">
        <Skeleton variant="rounded" className="w-[320px] h-[36px]" />
        <SnippetItem.Skeleton />
      </div>
      <Divider />
      <CommentsList.Skeleton />
    </Paper>
  );
};
