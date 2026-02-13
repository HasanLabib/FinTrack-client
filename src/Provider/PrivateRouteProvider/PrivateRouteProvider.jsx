import React from "react";

import { Navigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!user && !userLoading) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
