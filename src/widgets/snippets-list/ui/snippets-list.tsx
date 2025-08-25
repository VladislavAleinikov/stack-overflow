import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createGetSnippetsQueryOptions } from "../query-options/create-get-posts-query-option";
import { PaginatedList } from "@/features/paginated-list";
import { searchByOptions, sortOptions } from "../consts";
import { SnippetItem } from "@/features/snippet-item";
import type { FCWithSkeleton, Snippet } from "@/shared/types";
import { createUserQueryOptions } from "@/shared/query-options";
import { SnippetForm } from "@/features/snippet-form";

interface SnippetsListProps {
  userId?: number;
}

export const SnippetsList: FCWithSkeleton<SnippetsListProps> = ({ userId }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    sortBy: "",
    search: "",
  });
  const queryClient = useQueryClient();
  const [isSnippetFormOpen, setIsSnippetFormOpen] = useState<boolean>(false);
  const [snippet, setSnippet] = useState<Snippet>();
  const { data: user } = useSuspenseQuery(createUserQueryOptions(userId || -1));
  const {
    data: { data: snippets, meta },
  } = useSuspenseQuery(createGetSnippetsQueryOptions(searchParams));

  const onOpenSnippetFrom = (snippet?: Snippet) => {
    setSnippet(snippet);
    setIsSnippetFormOpen(true);
  }

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["snippets"],
    });
  }, [searchParams]);

  useEffect(() => {    
    if (userId) {
      setSearchParams((prev) => {
        prev.set("userId", userId.toString());
        return prev;
      });
    }
  }, [userId]);

  return (
    <>
      <PaginatedList
        title={userId ? `${user!.username}'s snippets` : "Snippets"}
        meta={meta}
        itemsProps={snippets.map((snippet) => ({
          snippet,
          onOpenSnippetForm: () => onOpenSnippetFrom(snippet),
          key: snippet.id,
        }))}
        ItemComponent={SnippetItem}
        sortOptions={sortOptions}
        searchByOptions={searchByOptions}
        className="flex-row flex-wrap justify-around"
        onAddItem={() => onOpenSnippetFrom()}
      />
      <SnippetForm
        open={isSnippetFormOpen}
        onClose={() => setIsSnippetFormOpen(false)}
        snippet={snippet}
      />
    </>
  );
};

SnippetsList.Skeleton = () => {
  return (
    <>
      <PaginatedList.Skeleton
        ItemComponent={SnippetItem}
        className="flex-row flex-wrap justify-around"
      />
    </>
  );
};
