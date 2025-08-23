import type { FCWithSkeleton } from "@/shared/types";
import { Button, Skeleton } from "@mui/material";
import usePagination from "@mui/material/usePagination";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { cn } from "@/shared/utils";
import type { ChangeEvent } from "react";

interface PaginatioinProps {
  totalPages: number;
  currentPage: number;
  onChange: (event: ChangeEvent<unknown>, page: number) => void;
}

export const Pagination: FCWithSkeleton<PaginatioinProps> = ({
  totalPages,
  currentPage,
  onChange,
}) => {
  const { items } = usePagination({
    page: currentPage,
    count: totalPages,
    onChange
  });

  return (
    <div className="relative">
      <div className="sticky top-12 flex flex-col space-y-2">
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;

          if (type === "start-ellipsis" || type === "end-ellipsis") {
            children = (
              <div className="flex justify-center items-center w-10 h-10">
                …
              </div>
            );
          } else if (type === "page") {
            children = (
              <Button
                variant="outlined"
                className={cn(
                  "rounded-full min-w-min w-10 h-10 p-1 text-sm leading-none",
                  selected ? "bg-secondary border-primary" : ""
                )}
                type="button"
                {...item}
              >
                {page}
              </Button>
            );
          } else {
            children = (
              <Button
                variant="outlined"
                className="rounded-full min-w-min w-10 h-10 p-1 text-sm leading-none"
                type="button"
                {...item}
              >
                {type == "previous" && <KeyboardArrowUpIcon />}
                {type == "next" && <KeyboardArrowDownIcon />}
              </Button>
            );
          }

          return <div key={index}>{children}</div>;
        })}
      </div>
    </div>
  );
};

Pagination.Skeleton = () => {
  return (
    <div className="relative">
      <div className="sticky top-12 flex flex-col space-y-2">
      {Array(9)
        .fill(0)
        .map((val, index) =>
          index === 6 ? (
            <div
              key={index}
              className="flex justify-center items-center w-10 h-10"
            >
              …
            </div>
          ) : (
            <Skeleton key={index} variant="circular" className="w-10 h-10" />
          )
        )}
      </div>
      </div>
  );
};
