import { createAuthQueryOptions } from "@/shared/query-options";
import { SnippetsList } from "@/widgets/snippets-list";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useParams } from "react-router";

interface SnippetsPageProps {
  isThisUserSnippets?: boolean;
}

export const SnippetsPage: React.FC<SnippetsPageProps> = ({
  isThisUserSnippets,
}) => {
  const { data: authUser } = useSuspenseQuery(createAuthQueryOptions());
  const params = useParams();
  let userId = undefined;

  if (isThisUserSnippets) {
    userId = authUser?.id;
  } else if (params["id"]) {
    userId = parseInt(params["id"]);
  }

  return (
    <div>
      <Suspense fallback={<SnippetsList.Skeleton />}>
        <SnippetsList userId={userId} />
      </Suspense>
    </div>
  );
};
