import React from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import Layout from "../Layout/Layout";
import Register from "../Pages/Authentication/Register/Register";
import Login from "../Pages/Authentication/Login/Login";
import ProtectedRoute from "../Provider/PrivateRouteProvider/PrivateRouteProvider";
import DashBoardLayout from "../Pages/DashBoard/DashBoardLayout";
import UserDashBoard from "../Pages/DashBoard/UserDashBoard/UserDashBoard";
import AdminDashBoard from "../Pages/DashBoard/AdminDashboard/AdminDashBoard";
import RoleBasedRedirect from "../Pages/DashBoard/RoleBasedRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashBoardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index:true,
        element: <RoleBasedRedirect /> ,
      },
      {
        path: "userDashboard",
        element: <UserDashBoard />,
      },
      {
        path: "adminDashboard",
        element: <AdminDashBoard />,
      },
    ],
  },
]);

export default router;
