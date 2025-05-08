import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    // Not logged in, redirect
    return <Navigate to="/LoginSignup" replace />;
  }
  // Logged in, render children
  return children;
}
export default ProtectedRoute;