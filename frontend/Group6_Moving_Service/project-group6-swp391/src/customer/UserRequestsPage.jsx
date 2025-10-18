import React, { useEffect, useMemo, useState } from "react";
import { Layout, Menu, Table, Tag, Modal, Pagination, Typography, Space, Button, Spin, Empty, Form, Input, InputNumber, message, DatePicker } from "antd";
import { OrderedListOutlined, ProfileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../service/axiosInstance";
import dayjs from "dayjs"; // Sử dụng dayjs cho Antd DatePicker

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const PAGE_SIZE = 5;

// Hàm chuyển đổi trạng thái sang Tag màu
const statusToTag = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (["PENDING", "CREATED"].includes(normalized)) return { color: "gold", text: status || "CHỜ XỬ LÝ" };
  if (["APPROVED", "DONE", "COMPLETED"].includes(normalized)) return { color: "green", text: status || "HOÀN TẤT" };
  if (["REJECTED", "CANCELLED", "CANCELED"].includes(normalized)) return { color: "red", text: status || "ĐÃ HỦY" };
  return { color: "blue", text: status || "KHÔNG RÕ" };
};

// **Thêm prop isEmbedded để kiểm soát việc hiển thị Layout bên ngoài**
const UserRequestsPage = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState(null); // [start, end]

  // Fetch Data
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
      message.error("Không thể tải danh sách yêu cầu.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Filter Requests
  const filteredRequests = useMemo(() => {
    if (!dateRange || dateRange.length !== 2 || !dateRange[0] || !dateRange[1]) {
      return requests;
    }
    const startDate = dateRange[0].startOf('day');
    const endDate = dateRange[1].endOf('day');

    return requests.filter((r) => {
      if (!r?.requestTime) return false;
      const t = dayjs(r.requestTime);
      return t.isAfter(startDate) && t.isBefore(endDate);
    });
  }, [requests, dateRange]);

  const total = filteredRequests.length;
  const currentItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRequests.slice(start, start + PAGE_SIZE);
  }, [page, filteredRequests]);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
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
      title: "Ngày yêu cầu",
      dataIndex: "requestTime",
      render: (val) => val ? dayjs(val).format('DD/MM/YYYY HH:mm') : "-",
      width: 150,
    },
    {
      title: "Ngày chuyển",
      dataIndex: "movingDay",
      render: (val) => val ? dayjs(val).format('DD/MM/YYYY') : "-",
      width: 120,
    },
    {
      title: "Địa điểm chuyển",
      dataIndex: "pickupAddress",
      ellipsis: true,
      render: (_v, record) => `${record.pickupAddress || '-'} → ${record.destinationAddress || '-'}`,
    },
    {
      title: "",
      key: "action",
      width: 100,
      render: (_v, record) => (
        <Button type="link" onClick={() => setSelected(record)} style={{ padding: 0 }}>
          Chi tiết
        </Button>
      ),
    },
  ];

  // --- Content JSX: Phần nội dung chính của trang ---
  const ContentJSX = (
    <div style={isEmbedded ? {} : { padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: 'wrap', gap: '10px' }}>
        <Title level={3} style={{ margin: 0 }}>Danh sách yêu cầu</Title>
        <Space>
          <DatePicker.RangePicker
            allowClear
            onChange={(vals) => {
              setDateRange(vals ? [dayjs(vals[0]), dayjs(vals[1])] : null);
              setPage(1);
            }}
            placeholder={["Từ ngày", "Đến ngày"]}
            format="DD/MM/YYYY"
          />
          <Text type="secondary">Tổng: {total}</Text>
          <Button type="primary" onClick={() => setCreateOpen(true)}>Tạo yêu cầu mới</Button>
        </Space>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
          <Spin size="large" tip="Đang tải yêu cầu..." />
        </div>
      ) : total === 0 ? (
        <Empty description="Chưa có yêu cầu nào được tạo." />
      ) : (
        <>
          <Table
            rowKey={(r) => r.requestId}
            columns={columns}
            dataSource={currentItems}
            pagination={false}
            bordered
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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

      {/* Modal Chi tiết Yêu cầu */}
      <Modal
        title={
          <Space>
            <span>Chi tiết yêu cầu</span>
            <Text type="secondary">#ID: {selected?.requestId}</Text>
          </Space>
        }
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={[
          <Button key="close" onClick={() => setSelected(null)}>Đóng</Button>,
        ]}
      >
        {selected ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text><strong>Trạng thái: </strong><Tag color={statusToTag(selected.status).color}>{statusToTag(selected.status).text}</Tag></Text>
            <Text><strong>Thời gian yêu cầu: </strong>{selected.requestTime ? dayjs(selected.requestTime).format('HH:mm:ss DD/MM/YYYY') : "-"}</Text>
            <Text><strong>Ngày dự định chuyển: </strong>{selected.movingDay ? dayjs(selected.movingDay).format('DD/MM/YYYY') : "-"}</Text>
            <Text><strong>Địa chỉ lấy hàng: </strong>{selected.pickupAddress || "-"}</Text>
            <Text><strong>Địa chỉ tới: </strong>{selected.destinationAddress || "-"}</Text>
            <Text><strong>Mô tả: </strong>{selected.description || "-"}</Text>
          </Space>
        ) : null}
      </Modal>

      {/* Modal Tạo Yêu cầu Mới */}
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
                  // Chuyển đổi dayjs object sang Date hoặc null
                  movingDay: values.movingDay ? values.movingDay.toDate() : null,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              message.success("Tạo yêu cầu thành công!");
              setCreateOpen(false);
              form.resetFields();
              await fetchData(); // Tải lại danh sách sau khi tạo
              setPage(1);
            } catch (e) {
              message.error("Tạo yêu cầu thất bại. Vui lòng thử lại.");
            } finally {
              setCreateLoading(false);
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
          <Form.Item label="Mã doanh nghiệp (tùy chọn)" name="businessId">
            <InputNumber style={{ width: '100%' }} placeholder="Nhập Business ID (nếu có)" />
          </Form.Item>
          <Form.Item label="Ngày dự định chuyển nhà" name="movingDay">
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
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
    </div>
  );
  // --- Kết thúc Content JSX ---


  // Logic quyết định hiển thị Layout bên ngoài hay chỉ nội dung
  if (isEmbedded) {
    return ContentJSX;
  }

  return (
    <Layout style={{ background: "#fff", minHeight: 520 }}>
      <Sider width={260} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
        <div style={{ padding: 16 }}>
          <Title level={4} style={{ margin: 0, color: "#8B0000" }}>Giao dịch khách hàng</Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["my-requests"]}
          items={[
            { key: "my-requests", icon: <OrderedListOutlined />, label: "Danh sách yêu cầu", onClick: () => navigate("/my-requests") },
            // Bỏ mục "Thông tin cá nhân" theo yêu cầu
            { type: 'divider' },
            { key: "logout", label: "Đăng xuất", danger: true, onClick: () => { /* Logic đăng xuất */ } },
          ]}
        />
      </Sider>
      <Content>
        {/* Nhúng nội dung chính */}
        {ContentJSX}
      </Content>
    </Layout>
  );
};

export default UserRequestsPage;