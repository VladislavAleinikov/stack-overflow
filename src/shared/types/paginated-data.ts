export type PaginatedData<T> = {
  data: T[],
  meta: Meta
}

type Meta = {
itemsPerPage: number;
totalItems: number;
currentPage: number;
totalPages: number;
sortBy: [string, "ASC" | "DESC"][];
searchBy: string[];
search: string;
select: string[];
// filter: Record<any, any>;
}