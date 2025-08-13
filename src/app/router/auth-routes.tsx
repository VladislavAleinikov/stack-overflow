import { PostPage } from "../../pages/post";
import { PostsPage } from "../../pages/posts";
import { QuestionPage } from "../../pages/question";
import { QuestionsPage } from "../../pages/questions";
import { UserPage } from "../../pages/user";
import { UsersPage } from "../../pages/users";
import type { RouteType } from "../../shared/types";

export const authRoutes: RouteType[] = [
  {
    path: "/users",
    element: <UsersPage/>
  },
  {
    path: "/users/me",
    element: <UserPage isThisUser/>
  },
  {
    path: "/users/:id",
    element: <UserPage/>
  },
  {
    path: "/posts/my",
    element: <PostsPage isThisUserPost/>
  },
  {
    path: "/questions",
    element: <QuestionsPage/>
  },
  {
    path: "/question/:id",
    element: <QuestionPage/>
  }
];