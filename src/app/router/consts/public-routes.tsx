import { PostPage, SnippetsPage } from "@/pages";
import type { RouteType } from "@/shared/types";

export const publicRoutes: RouteType[] = [
  {
    path: "/",
    element: <SnippetsPage />,
  },
  {
    path: "/posts/:id",
    element: <PostPage />,
  },
];
