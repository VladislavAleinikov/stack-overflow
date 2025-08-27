import { Languages, type FCWithSkeleton } from "@/shared/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createQuestionQueryOptions } from "../query-options/create-question-query-options";
import { Button, Divider, Paper, Skeleton } from "@mui/material";
import { useNavigate } from "react-router";
import { CodeSnippet } from "@/entity/code-snippet";
import { createAuthQueryOptions } from "@/shared/query-options";
import EditIcon from "@mui/icons-material/Edit";
import { QuestionForm } from "@/features/question-form";
import { AnswersList } from "@/widgets/answers-list";
import { useState } from "react";
import { cn } from "@/shared/utils";

interface DetailedQuestionProps {
  questionId: number;
}

export const DetailedQuestion: FCWithSkeleton<DetailedQuestionProps> = ({
  questionId,
}) => {
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState<boolean>(false);
  const { data: question } = useSuspenseQuery(
    createQuestionQueryOptions(questionId)
  );
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const navigate = useNavigate();

  if (question === null) {
    return (
      <Paper className="p-16 flex flex-col justify-center items-center space-y-4">
        <h1>404</h1>
        <h3>Question not found!</h3>
        <Button variant="contained" onClick={() => navigate("/")}>
          Return to home page
        </Button>
      </Paper>
    );
  }

  const { id, title, description, attachedCode, user, answers, isResolved } =
    question;
  const isAuthUserAuthor = user.id === authUser?.id;

  return (
    <Paper className="w-[80%] p-16 flex flex-col space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-end">
          <h3 className={cn("tracking-wider", isResolved && "text-success")}>
            {title}
          </h3>
          {isAuthUserAuthor && (
            <>
              <Button
                variant="contained"
                onClick={() => setIsQuestionFormOpen(true)}
              >
                <EditIcon className="w-4 h-4 mr-2" />
                Edit question
              </Button>
              <QuestionForm
                open={isQuestionFormOpen}
                onClose={() => setIsQuestionFormOpen(false)}
                question={question}
              />
            </>
          )}
        </div>
        <span className="text-xs text-primary/70">
          Asked by:{" "}
          <span
            className="cursor-pointer italic underline hover:text-primary"
            onClick={() => navigate(`/users/${user.id}`)}
          >
            {user.username}
          </span>
        </span>
        <p className="text-left whitespace-pre-line">{description}</p>
        <CodeSnippet
          author={user}
          code={attachedCode}
          language={Languages.JavaScript}
        />
      </div>
      <Divider />
      <AnswersList
        questionId={id}
        answers={answers}
        isAuthUserQuestionAuthor={isAuthUserAuthor}
      />
    </Paper>
  );
};

DetailedQuestion.Skeleton = () => {
  return (
    <Paper className="w-[80%] p-16 flex flex-col space-y-8">
      <div className="flex flex-col space-y-2">
        <Skeleton variant="rounded" className="w-[320px] h-[36px]" />
        <Skeleton variant="text" className="text-xs w-[90px]" />
        <Skeleton variant="rounded" className="w-full h-[80px]" />
        <Skeleton variant="rounded" className="w-full h-[150px]" />
      </div>
      <Divider />
      <AnswersList.Skeleton />
    </Paper>
  );
};
