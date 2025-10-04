import React from "react";
import Layout from "../components/Layout";
import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import LoginPage from '../HomePage/LoginPage';
import HomePage from '../HomePage/HomePage';
import CustomerRegisterForm from '../customer/CustomerRegisterForm';
import UserContractsPage from '../customer/UserContractPage';
import UserRequestsPage from '../customer/UserRequestsPage';
import CustomerPage from '../customer/CustomerPage';
import CreateAdminUser from '../admin/CreateAdminUser';





import AnimatedPage from "../components/AnimatedPage";
import LandingPage from "../HomePage/LandingPage";
import ProtectedRoute from "../auth/ProtectRoute";
import AccessDeniedPage from "../auth/AccessDeniedPage";
import AdminDashboard from "../admin/AdminDashBoard";
import ContractAssignment from "../manager/ContractAssigment";
import CustomerProfile from "../auth/ProfilePage";
import ProfilePage from "../auth/ProfilePage";
import SurveyDashboard from "../staff/SurveyDashboard";

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
  element: (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ContractAssignment />
    </ProtectedRoute>
  ),
},
        {
          path:"user-profile",
          element: <ProfilePage/>
        },
        {
          path:"survey-dashboard",
          element: <SurveyDashboard/>
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
        {
          path:"my-requests",
          element:<UserRequestsPage/>
        },
        {
          path:"admin-create-user",
          element:<CreateAdminUser/>

        },

        { path: "access-denied", element: <AccessDeniedPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
