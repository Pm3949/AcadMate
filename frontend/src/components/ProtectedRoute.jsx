import { useAuth } from './context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Debug logging
  console.log("🔐 ProtectedRoute check:");
  console.log("  - Current path:", location.pathname);
  console.log("  - User:", user);
  console.log("  - Loading:", loading);
  console.log("  - User exists:", !!user);
  
  if (loading) {
    console.log("🔐 ProtectedRoute: Still loading...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    console.log("🔐 ProtectedRoute: No user found, redirecting to login");
    console.log("🔐 Saving intended destination:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log("🔐 ProtectedRoute: User authenticated, rendering children");
  return children;
}

export default ProtectedRoute;