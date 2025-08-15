import { Route, Routes } from "react-router";
import type { RouteType } from "../../shared/types";
import { publicRoutes, unauthRountes, authRoutes } from "./consts";
import { BrowserRouter } from "react-router";
import { Layout } from "../../pages/layout";
import { useAuthUser } from "../../shared/hooks";

export const PageRouter = () => {
  const isAuth = useAuthUser((store) => store.authUser !== null);
  const routes: RouteType[] = publicRoutes.concat(
    isAuth ? authRoutes : unauthRountes
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
