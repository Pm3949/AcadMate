// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userAuth = useSelector((state) => state.auth.authUser?.user);

  return userAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
