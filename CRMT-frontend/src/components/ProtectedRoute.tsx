"use client";

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    toast.error("You need to log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  if (role === null || !allowedRoles.includes(role)) {
    toast.error("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;