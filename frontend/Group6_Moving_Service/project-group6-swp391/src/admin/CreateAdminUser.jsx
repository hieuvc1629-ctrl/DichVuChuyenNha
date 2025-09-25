import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Select, message } from "antd";

const { Option } = Select;

export default function CreateAdminUser() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/admin/all-roles", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setRoles(res.data.result))
      .catch((err) => {
        console.error(err);
        message.error("Không load được roles");
      });
  }, []);

  const onFinish = (values) => {
    const token = localStorage.getItem("token");

    // Nếu chọn employee thì gọi API khác
    const url =
      selectedRole &&
      roles.find((r) => r.roleId === selectedRole)?.roleName === "employee"
        ? "http://localhost:8080/api/admin/create-employee"
        : "http://localhost:8080/api/admin/create-admin";

    axios
      .post(url, values, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        message.success("Tạo tài khoản thành công!");
        console.log(res.data);
        form.resetFields(); // reset form sau khi tạo thành công
        setSelectedRole(null);
      })
      .catch((err) => {
        console.error(err);
        message.error(
          err.response?.data?.message || "Tạo tài khoản thất bại!"
        );
      });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400 }}
    >
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item name="email" label="Email">
        <Input type="email" />
      </Form.Item>

      <Form.Item name="phone" label="Phone">
        <Input />
      </Form.Item>

      <Form.Item
        name="roleId"
        label="Chọn Role"
        rules={[{ required: true, message: "Vui lòng chọn role" }]}
      >
        <Select
          placeholder="Chọn role"
          onChange={(value) => setSelectedRole(value)}
        >
          {roles.map((r) => (
            <Option key={r.roleId} value={r.roleId}>
              {r.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Nếu role là employee thì hiện thêm field */}
      {selectedRole &&
        roles.find((r) => r.roleId === selectedRole)?.roleName ===
          "employee" && (
          <>
            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: "Vui lòng nhập position" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select placeholder="Chọn status">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </>
        )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Tạo tài khoản
        </Button>
      </Form.Item>
    </Form>
  );
}
