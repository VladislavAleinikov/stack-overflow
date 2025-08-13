import { Outlet } from "react-router";
import { Navigation } from "@/widgets/navigation";

export const Layout = () => {
  return (
    <div className="h-full">
      <Navigation />
      <div className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
