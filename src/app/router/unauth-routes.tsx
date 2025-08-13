import { LoginPage } from "../../pages/login";
import { RegisterPage } from "../../pages/register";
import type { RouteType } from "../../shared/types";

export const unauthRountes: RouteType[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];
