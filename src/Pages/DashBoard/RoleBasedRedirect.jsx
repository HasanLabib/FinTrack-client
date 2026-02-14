import React from "react";
import { Navigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const RoleBasedRedirect = () => {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    return <div className="p-4 text-white bg-[#201F24]">Loading...</div>;
  }

  if (!user && !userLoading) {
    return <Navigate to="/login" replace />;
  }
  //console.log("User : ", user);

  const dashBoardPath =
    user.role === "admin" ? "adminDashboard" : "userDashboard";
  return <Navigate to={`/dashboard/${dashBoardPath}`} replace />;
};

export default RoleBasedRedirect;
