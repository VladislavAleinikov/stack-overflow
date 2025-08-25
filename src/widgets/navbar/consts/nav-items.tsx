import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import PersonIcon from "@mui/icons-material/Person";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import GroupIcon from "@mui/icons-material/Group";

type NavItem = {
  to: string;
  title: string;
  icon: React.ReactNode;
  isPublic: boolean;
};

export const navItems: NavItem[] = [
  {
    to: "/",
    title: "Home",
    icon: <HomeFilledIcon className="w-5 h-5 mr-2" />,
    isPublic: true,
  },
  {
    to: "/users/me",
    title: "My Account",
    icon: <PersonIcon className="w-5 h-5 mr-2" />,
    isPublic: false,
  },
  {
    to: "/users/me/snippets",
    title: "My snippets",
    icon: <TextSnippetIcon className="w-5 h-5 mr-2" />,
    isPublic: false,
  },
  {
    to: "/questions",
    title: "Questions",
    icon: <LiveHelpIcon className="w-5 h-5 mr-2" />,
    isPublic: false,
  },
  {
    to: "/users",
    title: "Users",
    icon: <GroupIcon className="w-5 h-5 mr-2" />,
    isPublic: false,
  },
];
