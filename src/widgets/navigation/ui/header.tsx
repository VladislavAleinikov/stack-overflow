import { useAuthUser } from "@/shared/hooks";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";

interface NavbarProps {
  orgId?: string;
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Header = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const isAuth = useAuthUser((store) => store.authUser !== null);

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
            {isAuth ? (
              <Button variant="contained" onClick={() => {}}>
                <LogoutIcon className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            ) : (
              <>
                <Button variant="contained" onClick={() => {}}>
                  <PersonAddIcon className="w-4 h-4 mr-2" />
                  Sign up
                </Button>
                <Button variant="contained" onClick={() => {}}>
                  <LoginIcon className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};
