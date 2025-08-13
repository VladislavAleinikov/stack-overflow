import { PostPage, PostsPage } from "@/pages";
import type { RouteType } from "@/shared/types";

export const publicRoutes: RouteType[] = [
  {
    path: "/",
    element: <PostsPage />,
  },
  {
    path: "/posts/:id",
    element: <PostPage />,
  },
];
