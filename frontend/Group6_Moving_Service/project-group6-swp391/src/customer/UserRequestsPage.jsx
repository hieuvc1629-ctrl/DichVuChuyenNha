import React, { useEffect, useMemo, useState } from "react";
import { Layout, Menu, Table, Tag, Modal, Pagination, Typography, Space, Button, Spin, Empty, Form, Input, InputNumber, message } from "antd";
import { ProfileOutlined, FileTextOutlined, OrderedListOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const PAGE_SIZE = 5;

const statusToTag = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (["PENDING", "CREATED"].includes(normalized)) return { color: "gold", text: status || "PENDING" };
  if (["APPROVED", "DONE", "COMPLETED"].includes(normalized)) return { color: "green", text: status || "APPROVED" };
  if (["REJECTED", "CANCELLED", "CANCELED"].includes(normalized)) return { color: "red", text: status || "REJECTED" };
  return { color: "blue", text: status || "-" };
};

const UserRequestsPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/requests/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res?.data?.result || [];
        items.sort((a, b) => Number(b.requestId ?? 0) - Number(a.requestId ?? 0));
        setRequests(items);
      } catch (e) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const total = requests.length;
  const currentItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [page, requests]);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: 72,
      render: (_v, _r, idx) => (page - 1) * PAGE_SIZE + idx + 1,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (val) => {
        const t = statusToTag(val);
        return <Tag color={t.color}>{t.text}</Tag>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "requestTime",
      render: (val) => val || "-",
    },
    {
      title: "Lấy hàng",
      dataIndex: "pickupAddress",
      ellipsis: true,
      render: (val) => val || "-",
    },
    {
      title: "Địa chỉ tới",
      dataIndex: "destinationAddress",
      ellipsis: true,
      render: (val) => val || "-",
    },
    {
      title: "",
      key: "action",
      width: 150,
      render: (_v, record) => (
        <Space>
          <Button type="primary" onClick={() => setSelected(record)}>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },

  ];

  return (
    <Layout style={{ background: "#fff", minHeight: 520 }}>
      <Sider width={260} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
        <div style={{ padding: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Tài khoản</Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["my-requests"]}
          items={[
            { key: "my-requests", icon: <OrderedListOutlined />, label: "Danh sách yêu cầu", onClick: () => navigate("/my-requests") },
            { key: "profile", icon: <ProfileOutlined />, label: "Thông tin cá nhân", onClick: () => navigate("/customer-page") },           
          ]}
        />
      </Sider>
      <Content style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0 }}>Danh sách yêu cầu</Title>
          <Space>
            <Text type="secondary">Tổng cộng {total} yêu cầu</Text>
            <Button type="primary" onClick={() => setCreateOpen(true)}>Tạo yêu cầu mới</Button>
          </Space>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
            <Spin size="large" />
          </div>
        ) : total === 0 ? (
          <Empty description="Chưa có yêu cầu" />
        ) : (
          <>
            <Table
              rowKey={(r) => r.requestId}
              columns={columns}
              dataSource={currentItems}
              pagination={false}
              bordered
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <Pagination
                current={page}
                pageSize={PAGE_SIZE}
                total={total}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}

        <Modal
          title={
            selected ? (
              <Space>
                <span>Chi tiết yêu cầu</span>
                <Text type="secondary">#ID: {selected.requestId}</Text>
              </Space>
            ) : (
              "Chi tiết yêu cầu"
            )
          }
          open={!!selected}
          onCancel={() => setSelected(null)}
          footer={[
            <Button key="close" onClick={() => setSelected(null)}>Đóng</Button>,
          ]}
        >
          {selected ? (
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div>
                <Text strong>Trạng thái: </Text>
                <Tag color={statusToTag(selected.status).color}>{statusToTag(selected.status).text}</Tag>
              </div>
              <div>
                <Text strong>Thời gian: </Text>
                <Text>{selected.requestTime || "-"}</Text>
              </div>
              <div>
                <Text strong>Mô tả: </Text>
                <Text>{selected.description || "-"}</Text>
              </div>
              <div>
                <Text strong>Địa chỉ lấy hàng: </Text>
                <Text>{selected.pickupAddress || "-"}</Text>
              </div>
              <div>
                <Text strong>Địa chỉ tới: </Text>
                <Text>{selected.destinationAddress || "-"}</Text>
              </div>
            </Space>
          ) : null}
        </Modal>

        <Modal
          title="Tạo yêu cầu mới"
          open={createOpen}
          onCancel={() => {
            if (!createLoading) setCreateOpen(false);
          }}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values) => {
              if (!token) {
                message.warning("Vui lòng đăng nhập để tạo yêu cầu");
                return;
              }
              setCreateLoading(true);
              try {
                await api.post(
                  "/requests/create",
                  {
                    description: values.description,
                    businessId: values.businessId || null,
                    pickupAddress: values.pickupAddress,
                    destinationAddress: values.destinationAddress,
                  },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success("Tạo yêu cầu thành công");
                setCreateOpen(false);
                form.resetFields();
                // refetch
                setLoading(true);
                const res = await api.get("/requests/my", { headers: { Authorization: `Bearer ${token}` } });
                const items = res?.data?.result || [];
                items.sort((a, b) => Number(b.requestId ?? 0) - Number(a.requestId ?? 0));
                setRequests(items);
                setPage(1);
              } catch (e) {
                message.error("Tạo yêu cầu thất bại");
              } finally {
                setCreateLoading(false);
                setLoading(false);
              }
            }}
          >
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả yêu cầu" }]}
            >
              <Input.TextArea rows={4} placeholder="Mô tả yêu cầu chuyển nhà của bạn" />
            </Form.Item>
            <Form.Item label="Mã doanh nghiệp (nếu có)" name="businessId">
              <InputNumber style={{ width: '100%' }} placeholder="Nhập Business ID (tùy chọn)" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ lấy hàng"
              name="pickupAddress"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ lấy hàng" }]}
            >
              <Input placeholder="VD: 123 Lê Lợi, Quận 1, TP. HCM" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ tới"
              name="destinationAddress"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ tới" }]}
            >
              <Input placeholder="VD: 456 Trần Phú, Quận 5, TP. HCM" />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setCreateOpen(false)} disabled={createLoading}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={createLoading}>
                  Tạo yêu cầu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default UserRequestsPage;

