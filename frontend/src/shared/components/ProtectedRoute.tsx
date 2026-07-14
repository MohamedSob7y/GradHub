import { Navigate, Outlet } from "react-router-dom";
import { getTokenPayload } from "../../auth/authApi";

interface ProtectedRouteProps {
  allowedRole: "Student" | "Recruiter";
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const payload = getTokenPayload();

  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  // Check expiry
  if (payload.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Check role
  if (payload.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
