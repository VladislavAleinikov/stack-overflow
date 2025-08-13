import { LoginPage, RegisterPage } from "@/pages";
import type { RouteType } from "@/shared/types";

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
