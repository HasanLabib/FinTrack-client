import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import Layout from "../Layout/Layout";
import Register from "../Pages/Authentication/Register/Register";
import Login from "../Pages/Authentication/Login/Login";
import ProtectedRoute from "../Provider/PrivateRouteProvider/PrivateRouteProvider";
import DashBoardLayout from "../Pages/DashBoard/DashBoardLayout";
import UserDashBoard from "../Pages/DashBoard/UserDashBoard/UserDashBoard";
import AdminDashBoard from "../Pages/DashBoard/AdminDashboard/AdminDashBoard";
import RoleBasedRedirect from "../Pages/DashBoard/RoleBasedRedirect";
import CategoryMakeAdmin from "../Component/CategoryMakeAdmin/CategoryMakeAdmin";
import Income from "../Component/IncomeExpense/Income";
import TransactionPage from "../Pages/Transaction/TransactionPage";
import Expense from "../Component/IncomeExpense/Expense";
import Savings from "../Component/IncomeExpense/Savings";
import TransactionPageAdmin from "../Pages/Transaction/TransactionPageAdmin";
import AnalyticsDashboard from "../Pages/DashBoard/AnalyticsDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
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
        index: true,
        element: <RoleBasedRedirect />,
      },
      {
        path: "userDashboard",
        element: <UserDashBoard />,
        children: [
          {
            index: true,
            element: <Navigate to="overview" replace />,
          },
          {
            path: "overview",
            element: <AnalyticsDashboard />,
          },
          {
            path: "income",
            element: <Income />,
          },
          {
            path: "transaction",
            element: <TransactionPage />,
          },
          {
            path: "expense",
            element: <Expense />,
          },
          {
            path: "savings",
            element: <Savings />,
          },
        ],
      },
      {
        path: "adminDashboard",
        element: <AdminDashBoard />,
        children: [
          {
            path: "overview",
            element: <AnalyticsDashboard />,
          },
          {
            path: "category",
            element: <CategoryMakeAdmin />,
          },
          {
            path: "transaction",
            element: <TransactionPageAdmin />,
          },
        ],
      },
    ],
  },
]);

export default router;
