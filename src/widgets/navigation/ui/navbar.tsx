import { useAuthUser } from "../../../shared/hooks";

export const Navbar = () => {
  const isAuth = useAuthUser((store) => store.authUser !== null);

  return (
    <nav>
      
    </nav>
  )
}
