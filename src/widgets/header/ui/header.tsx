import Button from "@mui/material/Button";
import { Skeleton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";
import { useNavigate } from "react-router";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createAuthQueryOptions,
  createLogoutMutationOptions,
} from "@/shared/query-options";
import type { FCWithSkeleton } from "@/shared/types";

interface NavbarProps {
  orgId?: string;
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Header: FCWithSkeleton<NavbarProps> = ({
  isCollapsed,
  onResetWidth,
}) => {
  const { data } = useSuspenseQuery(createAuthQueryOptions());
  const { mutateAsync: logout } = useMutation(createLogoutMutationOptions());
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    await queryClient.invalidateQueries({
      queryKey: createAuthQueryOptions().queryKey,
    });
    navigate("/");
  };

  return (
    <>
      <header className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center gap-x-2">
            {data === null ? (
              <>
                <Button
                  variant="contained"
                  onClick={() => navigate("/register")}
                >
                  <PersonAddIcon className="w-4 h-4 mr-2" />
                  Sign up
                </Button>
                <Button variant="contained" onClick={() => navigate("/login")}>
                  <LoginIcon className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={onLogout}>
                <LogoutIcon className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};

Header.Skeleton = () => {
  return (
    <>
      <header className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center gap-x-2">
            <Skeleton variant="rounded" width={100} height={36.5} />
            <Skeleton variant="rounded" width={100} height={36.5} />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};
