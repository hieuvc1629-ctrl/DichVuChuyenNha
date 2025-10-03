import React from "react";
import Layout from "../components/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../HomePage/LoginPage";
import HomePage from "../HomePage/HomePage";

import CustomerRegisterForm from "../customer/CustomerRegisterForm";
import UserContractsPage from "../customer/UserContractPage";
import UserRequestsPage from "../customer/UserRequestsPage";
import CustomerPage from "../customer/CustomerPage";
import CreateAdminUser from "../admin/CreateAdminUser";
import AnimatedPage from "../components/AnimatedPage";
import ManagerContractsPage from "../manager/ManagerContractPage";

import LandingPage from "../HomePage/LandingPage";
import ProtectedRoute from "../auth/ProtectRoute";
import AccessDeniedPage from "../auth/AccessDeniedPage";
import AdminDashboard from "../admin/AdminDashBoard";
import ContractAssignment from "../manager/ContractAssigment";
import CustomerProfile from "../auth/ProfilePage";
import ProfilePage from "../auth/ProfilePage";




const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <LandingPage /> },

        {
          path: "",
          element: <HomePage/>
        },
         {
          path: "contract-assignment",
          element: <ContractAssignment/>
        },
        {
          path:"user-profile",
          element: <ProfilePage/>
        },
     



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

        // Admin routes
        {
          path: "admin-create-user",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdminUser />
            </ProtectedRoute>
          ),
        },

        {
          path: "admin-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          ),

        },
        {
          path:"my-requests",
          element:<UserRequestsPage/>

        },

        // user requests (customer)
        { path: "my-requests", element: <UserRequestsPage /> },

        { path: "access-denied", element: <AccessDeniedPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;

