import { Navigate } from "react-router-dom";
import { useSelector  } from 'react-redux'
import * as tokenService from '../services/tokenService';


export const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.user)
  const { token } = user;
  
  // Check if tokens exist in storage (localStorage or sessionStorage)
  const hasStoredTokens = tokenService.isAuthenticated();
  
  // If no token in Redux but tokens exist in storage, wait for restoration
  // This prevents premature redirect during session restoration
  if (!token && hasStoredTokens) {
    return null; // Return null to prevent rendering while auth is being restored
  }
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};