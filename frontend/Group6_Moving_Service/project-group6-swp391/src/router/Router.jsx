import React from 'react';
import Layout from '../components/Layout';

import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';

import LoginPage from '../HomePage/LoginPage';
import HomePage from '../HomePage/HomePage';
import CustomerRegisterForm from '../customer/CustomerRegisterForm';
import UserContractsPage from '../customer/UserContractPage';
import CustomerPage from '../customer/CustomerPage';
import CreateAdminUser from '../admin/CreateAdminUser';


// Wrapper để lấy :id từ URL và truyền vào ContractDetail


const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <HomePage/>
        },
        {
          path: "login",
          element: <LoginPage/>
        },
        {
          path:"customer-register",
          element:<CustomerRegisterForm/>
        },
        {
          path:"customer-page",
          element:<CustomerPage/>
        },
        {
          path:"list-contract-unsigned",
          element:<UserContractsPage/>
        },
        {
          path:"admin-create-user",
          element:<CreateAdminUser/>
        },

       
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default Router;
