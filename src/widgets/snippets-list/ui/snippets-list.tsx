import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createGetPostsQueryOptions } from "../query-options/create-get-posts-query-option";
import { PaginatedList } from "@/features/paginated-list";
import { searchByOptions, sortOptions } from "../consts";
import { SnippetItem } from "@/entity/post-item";

export const SnippetsList = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    sortBy: "",
    search: "",
  });
  const queryClient = useQueryClient();
  const {
    data: { data: snippets, meta },
  } = useSuspenseQuery(createGetPostsQueryOptions(searchParams));

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });
  }, [searchParams]);

  return (
    <PaginatedList
      title="Users"
      meta={meta}
      itemsProps={snippets.map((snippet) => ({ snippet, key: snippet.id }))}
      ItemComponent={SnippetItem}
      sortOptions={sortOptions}
      searchByOptions={searchByOptions}
      className="flex-row flex-wrap justify-around"
    />
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
