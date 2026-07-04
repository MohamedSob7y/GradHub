import { Navigate, Outlet } from "react-router-dom";
import type { JwtPayload } from "../types";

interface ProtectedRouteProps {
  allowedRole: "Student" | "Recruiter";
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let payload: JwtPayload;
  try {
    const base64Payload = token.split(".")[1];
    payload = JSON.parse(atob(base64Payload)) as JwtPayload;
  } catch {
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
