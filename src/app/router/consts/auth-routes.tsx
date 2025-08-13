import {
  PostPage,
  UserPage,
  UsersPage,
  PostsPage,
  QuestionPage,
  QuestionsPage,
} from "@/pages";
import type { RouteType } from "@/shared/types";

export const authRoutes: RouteType[] = [
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/users/me",
    element: <UserPage isThisUser />,
  },
  {
    path: "/users/:id",
    element: <UserPage />,
  },
  {
    path: "/posts/my",
    element: <PostsPage isThisUserPost />,
  },
  {
    path: "/posts/:id",
    element: <PostPage />,
  },
  {
    path: "/questions",
    element: <QuestionsPage />,
  },
  {
    path: "/question/:id",
    element: <QuestionPage />,
  },
];
