import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./style/LoginPage.css"; // dùng chung cho login và signup
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
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

    // Lưu token và userId (giả sử backend trả userId)
    localStorage.setItem("token", response.data.result.token);
    localStorage.setItem("userId", response.data.result.userId);
    alert("Login successful!");

    // Chuyển về trang chủ
    navigate("/");
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
                  textDecoration: "underline"
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
