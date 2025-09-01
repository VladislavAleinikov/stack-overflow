import { DetailedQuestion } from "@/widgets/detailed-question/ui/detailed-question";
import { Suspense } from "react";
import { useParams } from "react-router";

export const QuestionPage = () => {
  const params = useParams();

  return (
    <div className="h-full flex flex-col justify-center items-center space-y-12">
      <Suspense fallback={<DetailedQuestion.Skeleton />}>
        <DetailedQuestion questionId={parseInt(params.id!)} />
      </Suspense>
    </div>
  );
};
