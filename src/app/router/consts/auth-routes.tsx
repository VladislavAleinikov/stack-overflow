import {
  UserPage,
  UsersPage,
  SnippetsPage,
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
    path: "/users/me/snippets",
    element: <SnippetsPage isThisUserSnippets />,
  },
  {
    path: "/users/:id/snippets",
    element: <SnippetsPage />,
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
