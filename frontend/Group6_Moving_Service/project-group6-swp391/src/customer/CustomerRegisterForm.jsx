import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const CustomerRegisterForm = () => {
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users/roles");
        // Lọc chỉ lấy roleId = 4 hoặc 5
        const filteredRoles = res.data.result.filter(role => role.id === 4 || role.id === 5);
        setRoles(filteredRoles);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const initialValues = {
    username: "",
    password: "",
    roleId: "", 
    email: "",
    phone: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    roleId: Yup.number().required("Please select a role"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{9,11}$/, "Phone must be 9-11 digits")
      .required("Phone is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await axios.post("http://localhost:8080/api/users/create", values);
      setMessage(res.data.message);
      resetForm();
    } catch (err) {
      setMessage("Error creating user");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Customer Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label>Username</label>
            <Field type="text" name="username" className="form-control" />
            <ErrorMessage name="username" component="div" style={{ color: "red" }} />
          </div>

          <div>
            <label>Password</label>
            <Field type="password" name="password" className="form-control" />
            <ErrorMessage name="password" component="div" style={{ color: "red" }} />
          </div>

          <div>
            <label>Email</label>
            <Field type="email" name="email" className="form-control" />
            <ErrorMessage name="email" component="div" style={{ color: "red" }} />
          </div>

          <div>
            <label>Phone</label>
            <Field type="text" name="phone" className="form-control" />
            <ErrorMessage name="phone" component="div" style={{ color: "red" }} />
          </div>

          <div>
            <label>Role</label>
            <Field as="select" name="roleId" className="form-control">
              <option value="">-- Select role --</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </Field>
            <ErrorMessage name="roleId" component="div" style={{ color: "red" }} />
          </div>

          <button type="submit" style={{ marginTop: "10px" }}>
            Register
          </button>
        </Form>
      </Formik>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CustomerRegisterForm;
