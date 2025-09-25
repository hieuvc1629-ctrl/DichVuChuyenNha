import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Select, message } from "antd";

const { Option } = Select;

export default function CustomerRegisterForm() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users/roles")
      .then((res) => {
        setRoles(res.data.result || []);
      })
      .catch((err) => {
        console.error(err);
        message.error("Không load được roles!");
      });
  }, []);

  const onFinish = (values) => {
    let url = "";
    let payload = { ...values };

    const selectedRoleName = roles.find(
      (r) => r.roleId === selectedRole
    )?.roleName;

    if (selectedRoleName === "customer_company") {
      url = "http://localhost:8080/api/users/customer-company";
      delete payload.roleId; // 👈 Xóa vì backend không cần
    } else {
      url = "http://localhost:8080/api/users/create";
    }

    console.log("Payload gửi đi:", payload);

    axios
      .post(url, payload)
      .then((res) => {
        message.success("Đăng ký thành công!");
        console.log("Kết quả:", res.data);
        form.resetFields();
        setSelectedRole(null);
      })
      .catch((err) => {
        console.error("Lỗi:", err.response?.data || err);
        message.error(err.response?.data?.message || "Đăng ký thất bại!");
      });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 500, margin: "0 auto" }}
    >
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input placeholder="Nhập username" />
      </Form.Item>

      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password placeholder="Nhập password" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[{ required: true, message: "Nhập số điện thoại" }]}
      >
        <Input placeholder="Nhập số điện thoại" />
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

      {/* Nếu chọn customer_company thì hiện thêm field */}
      {selectedRole &&
        roles.find((r) => r.roleId === selectedRole)?.roleName ===
          "customer_company" && (
          <>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: "Nhập tên công ty" }]}
            >
              <Input placeholder="Nhập tên công ty" />
            </Form.Item>

            <Form.Item
              name="taxCode"
              label="Tax Code"
              rules={[{ required: true, message: "Nhập mã số thuế" }]}
            >
              <Input placeholder="Nhập mã số thuế" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Nhập địa chỉ" }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </>
        )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
}
