import { Outlet, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { createAuthQueryOptions } from "@/shared/query-options";
import { Suspense, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils";
import { Navbar } from "@/widgets/navbar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Header } from "@/widgets/header";

export const Layout = () => {
  useQuery(createAuthQueryOptions());
  const isMobile = window.innerWidth <= 768;
  const { pathname } = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);
  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
    }
  };

  return (
    <div className="h-full flex">
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999] transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronLeftIcon className="block h-6 w-6" />
        </div>
        <Suspense fallback={<Navbar.Skeleton />}>
          <Navbar />
        </Suspense>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)] transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <Suspense fallback={<Header.Skeleton />}>
          <Header isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        </Suspense>
      </div>
      <div className="flex-1 h-full overflow-y-auto mb-12 mt-24">
        <Outlet />
      </div>
    </div>
  );
};
