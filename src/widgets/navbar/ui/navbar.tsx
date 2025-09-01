import { NavLink } from "react-router";
import { navItems } from "../consts";
import { cn } from "@/shared/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createAuthQueryOptions } from "@/shared/query-options";
import { AccountMenu } from "@/features/account-menu";
import { Skeleton } from "@mui/material";

export const Navbar = () => {
  const { data } = useSuspenseQuery(createAuthQueryOptions());
  const isAuth = data !== null;
  const currentNavItems = isAuth
    ? navItems
    : navItems.filter(({ isPublic }) => isPublic);

  return (
    <nav>
      {isAuth && <AccountMenu user={data} />}
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

Navbar.Skeleton = () => {
  return (
    <ul className="min-h-[100vh] ml-8 mt-2">
      <Skeleton className="w-32 h-10" variant="rounded" />
      <li className="flex my-8">
        <Skeleton className="w-5 h-5 mr-2" variant="circular" />{" "}
        <Skeleton className="w-16" variant="text" />
      </li>
      <li className="flex my-8">
        <Skeleton className="w-5 h-5 mr-2" variant="circular" />{" "}
        <Skeleton className="w-18" variant="text" />
      </li>
      <li className="flex my-8">
        <Skeleton className="w-5 h-5 mr-2" variant="circular" />{" "}
        <Skeleton className="w-20" variant="text" />
      </li>
      <li className="flex my-8">
        <Skeleton className="w-5 h-5 mr-2" variant="circular" />{" "}
        <Skeleton className="w-16" variant="text" />
      </li>
      <li className="flex my-8">
        <Skeleton className="w-5 h-5 mr-2" variant="circular" />{" "}
        <Skeleton className="w-12" variant="text" />
      </li>
    </ul>
  );
};
