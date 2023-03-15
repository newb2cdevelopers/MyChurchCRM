import { Navigate } from "react-router-dom";
import { useSelector  } from 'react-redux'


export const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.user)
  const { token } = user;
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};