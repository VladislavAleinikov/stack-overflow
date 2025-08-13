import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <div className="h-full">
      <div className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
