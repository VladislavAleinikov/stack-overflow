import { PostPage } from "../../pages/post";
import { PostsPage } from "../../pages/posts";
import type { RouteType } from "../../shared/types";

export const publicRoutes: RouteType[] = [
  {
    path: "/",
    element: <PostsPage/>
  },
  {
    path: "/posts/:id",
    element: <PostPage/>
  },
];