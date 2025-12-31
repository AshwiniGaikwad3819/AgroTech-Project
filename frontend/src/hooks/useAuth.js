import { useSelector } from 'react-redux'

export const useAuth = () => {
  const { user, access } = useSelector((state) => state.auth)
  // console.log(user,access)
  return {
    isAuthenticated: Boolean(access),
    user,
    role: user?.role,
  }
}

export default useAuth







