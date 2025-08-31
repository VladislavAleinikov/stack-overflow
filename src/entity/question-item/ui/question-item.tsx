import type { FCWithSkeleton, Question } from "@/shared/types";
import { Button, Paper, Skeleton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router";
import { cn } from "@/shared/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createAuthQueryOptions } from "@/shared/query-options";
import CheckIcon from "@mui/icons-material/Check";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import EditIcon from "@mui/icons-material/Edit";

interface QuestionItemProps {
  question: Question;
  onOpenQuestionForm: () => void;
}

export const QuestionItem: FCWithSkeleton<QuestionItemProps> = ({
  question,
  onOpenQuestionForm,
}) => {
  const {
    id,
    title,
    description,
    isResolved,
    user: { id: userId, username },
  } = question;
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const navigate = useNavigate();

  const handleLinkClick =
    (link: string) => (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      e.stopPropagation();
      navigate(link);
    };

  const onEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    onOpenQuestionForm();
  };

  return (
    <Paper
      className="cursor-pointer w-full p-4 flex items-start space-x-4 group transition hover:shadow-xl"
      elevation={3}
      onClick={handleLinkClick(`/questions/${id}`)}
    >
      <div className="space-y-4">
        <div
          className={cn(
            "rounded-full border border-primary",
            isResolved && "border-success"
          )}
        >
          {isResolved ? (
            <Tooltip title="Already solved">
              <CheckIcon className="p-2 w-10 h-10 fill-success" />
            </Tooltip>
          ) : (
            <Tooltip title="Not solved yet">
              <QuestionMarkIcon className="p-2 w-10 h-10" />
            </Tooltip>
          )}
        </div>
        {userId === authUser?.id && (
          <Button
            variant="outlined"
            className="rounded-full p-0 min-w-min"
            onClick={onEdit}
          >
            <EditIcon className="p-2 w-10 h-10" />
          </Button>
        )}
      </div>
      <div className="flex flex-col space-y-2 items-start">
        <h3 className="cursor-pointer text-2xl group-hover:underline">
          {title}
        </h3>
        <span className="text-xs text-primary/70">
          Asked by:{" "}
          <span
            className="cursor-pointer italic underline hover:text-primary"
            onClick={handleLinkClick(`/users/${userId}`)}
          >
            {username}
          </span>
        </span>
        <p className="text-left line-clamp-3 whitespace-pre-line">
          {description}
        </p>
      </div>
    </Paper>
  );
};

QuestionItem.Skeleton = () => {
  return (
    <Paper className="w-full p-4 flex items-start space-x-4" elevation={3}>
      <Skeleton variant="circular" className="w-12 h-12" />
      <div className="w-full flex flex-col space-y-2 items-start">
        <Skeleton variant="text" className="text-2xl w-[150px]" />
        <Skeleton variant="text" className="text-xs w-[90px]" />
        <Skeleton variant="rounded" className="w-[350px] h-[80px]" />
      </div>
    </Paper>
  );
};
