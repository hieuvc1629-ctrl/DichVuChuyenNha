import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./style/LoginPage.css"; // dùng chung cho login và signup
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        values
      );

      // Lấy dữ liệu từ backend (AuthenticationResponse)
      const { token, userId, username, roleId, roleName } =
        response.data.result;

      // Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("roleName", roleName);

      alert("Login successful!");

      // Điều hướng theo roleId
      if (roleId === 4 || roleId === 5) {
        navigate("/customer-page");
      } else {
        navigate("/"); // ví dụ: admin/manager → home
      }
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
              <label>Email</label>
              <Field
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-text"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <Field type="password" name="password" className="form-input" />
              <ErrorMessage
                name="password"
                component="div"
                className="error-text"
              />
              <div className="forgot-text">Forgot?</div>
            </div>

            <button type="submit" className="auth-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <span>Chưa có tài khoản? </span>
              <button
                type="button"
                onClick={() => navigate("/customer-register")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#8B0000",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Đăng ký ngay
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
