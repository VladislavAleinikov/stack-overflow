import { SnippetPage, SnippetsPage } from "@/pages";

import type { RouteType } from "@/shared/types";

export const publicRoutes: RouteType[] = [
  {
    path: "/",
    element: <SnippetsPage />,
  },
  {
    path: "/snippets/:id",
    element: <SnippetPage />,
  },
];
