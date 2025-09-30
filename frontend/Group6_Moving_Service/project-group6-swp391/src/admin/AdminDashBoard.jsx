import React, { useEffect, useState } from "react";
import { Table, Card, Tabs, message, Button, Popconfirm, Modal, Form, Input, Select } from "antd";
import axios from "axios";
import CreateAdminUser from "./CreateAdminUser";

const { TabPane } = Tabs;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho modal edit
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  // Lấy danh sách user
  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setUsers(res.data.result); // ✅ vì backend trả ApiResponse
      })
      .catch((err) => {
        console.error(err);
        message.error("Không load được danh sách người dùng!");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mở modal sửa user
  const handleEdit = (user) => {
    setCurrentUser(user);
    form.setFieldsValue(user);
    setIsEditModalVisible(true);
  };

  // Submit sửa user
  const handleUpdateUser = () => {
    form.validateFields().then((values) => {
      axios
        .put(`http://localhost:8080/api/users/${currentUser.userId}`, values, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then(() => {
          message.success("Cập nhật người dùng thành công!");
          setIsEditModalVisible(false);
          fetchUsers();
        })
        .catch((err) => {
          console.error(err);
          message.error("Lỗi khi cập nhật người dùng!");
        });
    });
  };

  // Xóa user
  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:8080/api/users/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then(() => {
        message.success("Xóa người dùng thành công!");
        fetchUsers();
      })
      .catch((err) => {
        console.error(err);
        message.error("Lỗi khi xóa người dùng!");
      });
  };

  // Cấu hình bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.userId)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card title="Admin Dashboard" style={{ margin: 20 }}>
      <Tabs defaultActiveKey="1">
        {/* Tab danh sách user */}
        <TabPane tab="Danh sách người dùng" key="1">
          <Table
            rowKey="userId"
            columns={columns}
            dataSource={users}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </TabPane>

        {/* Tab tạo user */}
        <TabPane tab="Tạo người dùng" key="2">
          <CreateAdminUser onSuccess={fetchUsers} />
        </TabPane>
      </Tabs>

      {/* Modal sửa user */}
      <Modal
        title="Sửa người dùng"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdateUser}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Vui lòng nhập username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="roleId" label="Role">
            <Select>
              <Select.Option value={1}>Admin</Select.Option>
              <Select.Option value={2}>Manager</Select.Option>
              <Select.Option value={3}>Employee</Select.Option>
              <Select.Option value={4}>Customer</Select.Option>
              <Select.Option value={5}>Customer Company</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
