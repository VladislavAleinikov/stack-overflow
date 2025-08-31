import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createGetQuestionsQueryOptions } from "../query-options/create-get-questions-query-option";
import { PaginatedList } from "@/features/paginated-list";
import { searchByOptions, sortOptions } from "../consts";
import { QuestionItem } from "@/entity/question-item";
import type { Question } from "@/shared/types";
import { QuestionForm } from "@/features/question-form";

export const QuestionsList = () => {
  const [searchParams] = useSearchParams({
    page: "1",
    sortBy: "",
    search: "",
  });
  const queryClient = useQueryClient();
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<Question>();
  const queryOptions = createGetQuestionsQueryOptions(searchParams);;
  const {
    data: { data: questions, meta },
  } = useSuspenseQuery(queryOptions);

  const onOpenQuestionFrom = (question?: Question) => {
    setQuestion(question);
    setIsQuestionFormOpen(true);
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [queryOptions.queryKey[0]],
    });
  }, [queryClient, queryOptions.queryKey, searchParams]);

  return (
    <>
      <PaginatedList
        title="Questions"
        meta={meta}
        itemsProps={questions.map((question) => ({
          question,
          onOpenQuestionForm: () => onOpenQuestionFrom(question),
          key: question.id,
        }))}
        ItemComponent={QuestionItem}
        sortOptions={sortOptions}
        searchByOptions={searchByOptions}
        className="flex-row flex-wrap justify-around"
        onAddItem={() => onOpenQuestionFrom()}
      />
      <QuestionForm
        open={isQuestionFormOpen}
        onClose={() => setIsQuestionFormOpen(false)}
        question={question}
      />
    </>
  );
};

QuestionsList.Skeleton = () => {
  return (
    <>
      <PaginatedList.Skeleton
        ItemComponent={QuestionItem}
        className="flex-row flex-wrap justify-around"
      />
    </>
  );
};
