import { NavLink } from "react-router";
import { useAuthUser } from "../../../shared/hooks";
import { navItems } from "../consts";
import { cn } from "@/shared/utils";

export const Navbar = () => {
  const isAuth = useAuthUser((store) => store.authUser !== null);
  const currentNavItems = isAuth
    ? navItems
    : navItems.filter(({ isPublic }) => isPublic);

  return (
    <nav>
      {currentNavItems.map(({ to, title, icon }) => (
        <NavLink
          key={to}
          className={(isActive) =>
            cn(
              "flex items-center w-full py-4 px-8 rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-primary transition",
              isActive ? "" : ""
            )
          }
          to={to}
        >
          {icon}
          {title}
        </NavLink>
      ))}
    </nav>
  );
};
