import {
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
    path: "/questions",
    element: <QuestionsPage />,
  },
  {
    path: "/questions/:id",
    element: <QuestionPage />,
  },
];
