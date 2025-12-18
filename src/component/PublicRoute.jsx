import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const isAuth = !!localStorage.getItem("accessToken");

  if (isAuth) {
    return <Navigate to="/onboard?default=ProductionDashboard" replace />;
  }

  return children;
}
