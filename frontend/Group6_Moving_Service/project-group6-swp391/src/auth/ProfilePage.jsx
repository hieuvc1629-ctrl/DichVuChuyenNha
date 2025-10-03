import React, { useEffect } from "react";
import { Form, Input, Button, message, Card } from "antd";
import axios from "axios";

export default function ProfilePage() {
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  // Lấy profile khi load trang
  useEffect(() => {
    if (!token) {
      message.error("Bạn cần đăng nhập!");
      return;
    }

    axios
      .get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        form.setFieldsValue(res.data); // backend trả UserResponse
      })
      .catch((err) => {
        console.error(err);
        message.error("Không lấy được thông tin user!");
      });
  }, [form, token]);

  // Submit cập nhật profile
  const handleUpdate = (values) => {
    axios
      .put("http://localhost:8080/api/users/me", values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        message.success(res.data.message || "Cập nhật thành công!");
      })
      .catch((err) => {
        console.error(err);
        message.error("Lỗi khi cập nhật profile!");
      });
  };

  return (
    <Card title="Thông tin cá nhân" style={{ maxWidth: 500, margin: "20px auto" }}>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item name="username" label="Username" rules={[{ required: true, message: "Nhập username" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Email không hợp lệ" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại">
          <Input />
        </Form.Item>

        {/* 👉 Nút cập nhật */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
