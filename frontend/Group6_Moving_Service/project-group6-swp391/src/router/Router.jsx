import React from 'react';
import Layout from '../components/Layout';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from '../HomePage/LoginPage';
import CustomerRegisterForm from '../customer/CustomerRegisterForm';
import UserContractsPage from '../customer/UserContractPage';
import CustomerPage from '../customer/CustomerPage';
import CreateAdminUser from '../admin/CreateAdminUser';
import WorkProgressPage from '../employee/WorkProgressPage'; // ✅ thêm import
import CustomerWorkProgressPage from '../customer/CustomerWorkProgressPage';
import DamagePage from '../employee/DamagePage';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "login",
          element: <LoginPage />
        },
        {
          path: "customer-register",
          element: <CustomerRegisterForm />
        },
        {
          path: "customer-page",
          element: <CustomerPage />
        },
        {
          path: "list-contract-unsigned",
          element: <UserContractsPage />
        },
        {
          path: "admin-create-user",
          element: <CreateAdminUser />
        },
        {
          path: "employee/work-progress", // ✅ thêm route mới
          element: <WorkProgressPage />
        },
        {
           path: "/customer/work-progress" ,
          element: <CustomerWorkProgressPage />
          },
          {
          path: "employee/damages",
          element: <DamagePage />
        },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
