import { Route, Routes } from "react-router";
import type { RouteType } from "../../shared/types";
import { publicRoutes, unauthRountes, authRoutes } from "./consts";
import { BrowserRouter } from "react-router";
import { Layout } from "../../pages/layout";
import { useQuery } from "@tanstack/react-query";
import { createAuthQueryOptions } from "@/shared/query-options";
import { CircularProgress } from "@mui/material";

export const PageRouter = () => {
  const { data, isLoading } = useQuery(createAuthQueryOptions());

  const routes: RouteType[] = publicRoutes.concat(
    data === null ? unauthRountes : authRoutes
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {isLoading ? (
            <Route
              path="*"
              element={
                <div className="w-full h-[80vh] flex justify-center items-center">
                  <CircularProgress />
                </div>
              }
            />
          ) : (
            routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
