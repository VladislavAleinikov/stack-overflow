import { SortBy } from "@/shared/ui/sort-by";
import type { FCWithSkeleton, PaginatedData } from "@/shared/types";
import { cn } from "@/shared/utils";
import { FormControl, Input, InputLabel, Paper, Skeleton } from "@mui/material";
import { useSearchParams } from "react-router";
import { Pagination } from "@/shared/ui/pagination";
import { useDebounce } from "@/shared/hooks";
import { SearchInput } from "@/shared/ui/search-input";

interface PaginatedListProps<P> {
  title: string;
  meta: PaginatedData<unknown>["meta"];
  itemsProps: P[];
  ItemComponent: FCWithSkeleton<P>;
  sortOptions: [string, string][];
  searchByOptions?: string[];
  className?: string;
}

export function PaginatedList<T extends { key: number }>({
  title,
  meta,
  itemsProps,
  ItemComponent,
  sortOptions,
  searchByOptions,
  className,
}: PaginatedListProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    search: "",
    searchBy: "",
    sortBy: "",
  });
  const selectedSearchByOptions = searchParams.get("searchBy")
    ? searchParams.getAll("searchBy")
    : searchByOptions;
  
  const currentPage = +(searchParams.get("page") ?? 1);
  const debouncedHandler = useDebounce(handleSearch);

  const onPageChange = (e: unknown, page: number) => {
    setSearchParams((params) => {
      params.set("page", page.toString());
      return params;
    });
  };

  const onSortOptionChange = (option: string) => {
    setSearchParams((params) => {
      params.append("sortBy", option);
      return params;
    });
  };

  const onSearchByOptionChange = (options: string[]) => {
    setSearchParams((params) => {
      params.delete("searchBy");
      options.forEach((option) => params.append("searchBy", option));
      params.set("page", "1");
      return params;
    });
  };

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchParams((params) => {
      params.set("search", e.target.value);
      params.set("page", "1");
      return params;
    });
  }

  return (
    <div className="flex justify-center items-stretch space-x-8">
      <Pagination
        totalPages={meta.totalPages}
        currentPage={currentPage}
        onChange={onPageChange}
      />
      <Paper className="p-12 w-full text-end max-w-[80%] space-y-6">
        <h2 className="uppercase tracking-widest">{title}</h2>
        <div className="flex items-end space-x-8">
          <SearchInput
            defaultValue={searchParams.get("search") || ""}
            onChange={debouncedHandler}
            searchByOptions={searchByOptions}
            onSearchByChange={searchByOptions && onSearchByOptionChange}
            defaultSearchBy={selectedSearchByOptions}
          />
          <SortBy
            options={sortOptions}
            selectedOption={searchParams.get("sortBy")}
            onChange={onSortOptionChange}
          />
        </div>
        <div className={cn("flex flex-col gap-4", className)}>
          {itemsProps.map((props) => (
            <ItemComponent {...props} key={props.key} />
          ))}
        </div>
      </Paper>
    </div>
  );
}

PaginatedList.Skeleton = ({
  ItemComponent,
  className,
}: Pick<PaginatedListProps<never>, "ItemComponent" | "className">) => {
  return (
    <div className="flex justify-center items-stretch space-x-8">
      <Pagination.Skeleton />
      <Paper className="p-12 w-full text-end max-w-[80%] space-y-6">
        <Skeleton
          variant="rounded"
          className="ml-auto mb-12 w-[300px] h-[70px]"
        />
        <div className="flex items-end space-x-8">
          <Skeleton variant="rounded" className="w-[300px] h-[30px]" />
          <Skeleton variant="rounded" className="w-[100px] h-[30px]" />
        </div>
        <div className={cn("flex flex-col gap-4", className)}>
          {Array(15)
            .fill(0)
            .map((val, id) => (
              <ItemComponent.Skeleton key={id} />
            ))}
        </div>
      </Paper>
    </div>
  );
};
