import { Navigate } from 'react-router-dom';

import { useState } from 'react';
import { authApi } from '../../src/utils/api';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  userEffect (() => {
  setIsAuthenticated(authApi.isAuthenticated());
  }, []);
  if (!isAuthenticated) {
    // Not logged in, redirect
    return <Navigate to="/LoginSignup" replace />;
  }
  // Logged in, render children
  return children;
}
export default ProtectedRoute;