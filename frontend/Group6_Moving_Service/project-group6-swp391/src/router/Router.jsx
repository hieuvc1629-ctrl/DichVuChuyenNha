import React from 'react';
import Layout from '../components/Layout';

import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import Login from '../HomePage/LoginPage';
import LoginPage from '../HomePage/LoginPage';
import CustomerRegisterForm from '../customer/CustomerRegisterForm';
import AuthPage from '../components/AuthPage';

// Wrapper để lấy :id từ URL và truyền vào ContractDetail


const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "login",
          element: <LoginPage/>
        },
        {
          path:"customer-register",
          element:<CustomerRegisterForm/>
        },
       
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default Router;
