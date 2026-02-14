import React from "react";

import { Navigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import Loading from "../../utils/Loading";

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    return <Loading />;
  }

  if (!user && !userLoading) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
