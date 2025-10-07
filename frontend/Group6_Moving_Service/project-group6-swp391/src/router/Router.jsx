// src/router/Router.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ManagerAssignmentPage from "../manager/ManagerAssignmentPage";

import Layout from "../components/Layout";
import LoginPage from "../HomePage/LoginPage";
import CustomerRegisterForm from "../customer/CustomerRegisterForm";
import UserContractsPage from "../customer/UserContractPage";
import CustomerPage from "../customer/CustomerPage";
import CreateAdminUser from "../admin/CreateAdminUser";
import WorkProgressPage from "../employee/WorkProgressPage";
import WorkProgressCustomerPage from "../customer/WorkProgressCustomerPage";
const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "customer-register",
          element: <CustomerRegisterForm />,
        },
        {
          path: "customer-page",
          element: <CustomerPage />,
        },
        {
          path: "list-contract-unsigned",
          element: <UserContractsPage />,
        },
        {
          path: "admin-create-user",
          element: <CreateAdminUser />,
        },
        {
          path: "employee/work-progress",
          element: <WorkProgressPage />,
        },
        {
          path: "customer/work-progress", // 👈 thêm route này
          element: <WorkProgressCustomerPage />,
        },
    

      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
