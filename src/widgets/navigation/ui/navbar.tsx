import { useAuthUser } from '../../../shared/hooks/use-auth-user'

export const Navbar = () => {
  const isAuth = useAuthUser(store => store.authUser !== null);

  return (
    <nav>
      
    </nav>
  )
}
