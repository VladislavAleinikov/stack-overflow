import { QuestionsList } from "@/widgets/questions-list";
import { Suspense } from "react";

export const QuestionsPage = () => {
  return (
    <div>
      <Suspense fallback={<QuestionsList.Skeleton />}>
        <QuestionsList />
      </Suspense>
    </div>
  );
};
