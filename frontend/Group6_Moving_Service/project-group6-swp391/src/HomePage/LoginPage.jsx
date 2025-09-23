import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./style/LoginPage.css"; // dùng chung cho login và signup

const LoginPage = () => {
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", values);
      localStorage.setItem("token", response.data.result.token);
      alert("Login successful!");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Please login to your account</p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label>Username</label>
              <Field type="text" name="username" className="form-input" />
              <ErrorMessage name="username" component="div" className="error-text" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <Field type="password" name="password" className="form-input" />
              <ErrorMessage name="password" component="div" className="error-text" />
              <div className="forgot-text">Forgot?</div>
            </div>

            <button type="submit" className="auth-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
