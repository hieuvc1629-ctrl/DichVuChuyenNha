import React from "react";
import Layout from "../components/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "../HomePage/LoginPage";
import CustomerRegisterForm from "../customer/CustomerRegisterForm";
import UserContractsPage from "../customer/UserContractPage";
import CustomerPage from "../customer/CustomerPage";
import CreateAdminUser from "../admin/CreateAdminUser";
import AdminDashboard from "../admin/AdminDashboard"; // 👈 thêm import
import ProtectedRoute from "../auth/ProtectRoute";
import AccessDeniedPage from "../auth/AccessDeniedPage";
import LandingPage from "../HomePage/LandingPage";

import AnimatedPage from "../components/AnimatedPage";
import ManagerContractsPage from "../manager/ManagerContractPage";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <LandingPage /> },
        {
          path: "login",
          element: (
            <AnimatedPage>
              <LoginPage />
            </AnimatedPage>
          ),
        },
        {
          path: "customer-register",
          element: (
            <AnimatedPage>
              <CustomerRegisterForm />
            </AnimatedPage>
          ),
        },
        { path: "customer-page", element: <CustomerPage /> },
        { path: "manager-dashboard", element: <ManagerContractsPage /> },
        { path: "list-contract-unsigned", element: <UserContractsPage /> },

        // 🔑 route cũ tạo user riêng
        {
          path: "admin-create-user",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdminUser />
            </ProtectedRoute>
          ),
        },

        // 📊 route mới Admin Dashboard
        {
          path: "admin-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },

        { path: "access-denied", element: <AccessDeniedPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
