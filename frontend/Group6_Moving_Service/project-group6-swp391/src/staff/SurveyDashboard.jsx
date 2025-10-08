import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Select,
  DatePicker,
  message,
  Modal,
  Menu,
  Popconfirm,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Content, Sider } = Layout;
const { Option } = Select;

const SurveyDashboard = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [quoteForm] = Form.useForm();
  const [requests, setRequests] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeMenu, setActiveMenu] = useState("survey");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lưu dữ liệu form QuotationService theo quotationId
  const [quotationServiceForm, setQuotationServiceForm] = useState({});
  const [quotationServicesList, setQuotationServicesList] = useState({}); // key = quotationId, value = array of services

  // ===== Fetch data =====
  useEffect(() => {
    fetchRequests();
    fetchSurveys();
    fetchQuotations();
    fetchServices();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/surveys");
      setSurveys(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/quotations");
      setQuotations(res.data);

      // Initialize quotationServicesList
      const qs = {};
      for (let q of res.data) {
        qs[q.quotationId] = q.quotationServices || [];
      }
      setQuotationServicesList(qs);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/prices");
      setServiceList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Create Survey =====
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        surveyDate: values.surveyDate.toISOString(),
        status: "DONE",
      };
      await axios.post("http://localhost:8080/api/surveys", payload);
      message.success("Tạo khảo sát thành công!");
      form.resetFields();
      setSelectedRequest(null);
      fetchSurveys();
    } catch (err) {
      message.error("Tạo khảo sát thất bại!");
    }
  };

  // ===== Delete Survey =====
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/surveys/${id}`);
      message.success("Xóa khảo sát thành công!");
      fetchSurveys();
    } catch (err) {
      message.error("Không thể xóa khảo sát!");
    }
  };

  // ===== Edit Survey =====
  const handleEdit = (record) => {
    setEditingSurvey(record);
    editForm.setFieldsValue({
      ...record,
      surveyDate: dayjs(record.surveyDate),
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      await axios.put(`http://localhost:8080/api/surveys/${editingSurvey.surveyId}`, {
        ...values,
        surveyDate: values.surveyDate.toISOString(),
      });
      message.success("Cập nhật khảo sát thành công!");
      setEditModalVisible(false);
      fetchSurveys();
    } catch (err) {
      message.error("Lỗi khi cập nhật khảo sát!");
    }
  };

  // ===== Create Quotation =====
  const handleCreateQuotation = async (values) => {
    try {
      const payload = {
        ...values,
       createdDate: values.createdDate
        ? dayjs(values.createdDate).format("YYYY-MM-DDTHH:mm:ss")
        : null,
      };
      await axios.post("http://localhost:8080/api/quotations", payload);
      message.success("Tạo báo giá thành công!");
      quoteForm.resetFields();
      fetchQuotations();
    } catch (err) {
      message.error("Tạo báo giá thất bại!");
    }
  };

  // ===== Create Quotation Service =====
  const handleQuotationServiceChange = (quotationId, field, value) => {
    setQuotationServiceForm((prev) => ({
      ...prev,
      [quotationId]: {
        ...prev[quotationId],
        [field]: value,
      },
    }));
  };

  const handleCreateQuotationService = async (quotationId) => {
    try {
      const data = quotationServiceForm[quotationId];
      if (!data.serviceId || !data.priceId || !data.quantity) {
        message.warning("Vui lòng chọn service, price và quantity!");
        return;
      }
      const payload = {
        quotationId: Number(quotationId),
        serviceId: Number(data.serviceId),
        priceId: Number(data.priceId),
        quantity: Number(data.quantity),
      };
      const res = await axios.post("http://localhost:8080/api/quotation-services", payload);
      message.success("Thêm Quotation Service thành công!");
      
      // Cập nhật danh sách services cho quotation này
      setQuotationServicesList((prev) => ({
        ...prev,
        [quotationId]: [...(prev[quotationId] || []), res.data],
      }));

      // Reset form
      setQuotationServiceForm((prev) => ({
        ...prev,
        [quotationId]: {},
      }));

      // Cập nhật totalPrice cho quotation
      setQuotations((prev) =>
        prev.map((q) =>
          q.quotationId === quotationId
            ? { ...q, totalPrice: ((prev[quotationId]?.reduce((acc, s) => acc + s.subtotal, 0)) || 0) + res.data.subtotal }
            : q
        )
      );
    } catch (err) {
      console.error(err);
      message.error("Thêm Quotation Service thất bại!");
    }
  };

  const handleQuantityChange = async (quotationId, serviceIndex, delta) => {
    const service = quotationServicesList[quotationId][serviceIndex];
    const newQuantity = Math.max(0, service.quantity + delta);

    try {
      // Update quantity trên backend
      const res = await axios.put(`http://localhost:8080/api/quotation-services/${service.id}`, {
        ...service,
        quantity: newQuantity,
        subtotal: newQuantity * service.price.amount,
      });

      // Cập nhật frontend
      setQuotationServicesList((prev) => {
        const updated = [...prev[quotationId]];
        updated[serviceIndex] = res.data;
        return { ...prev, [quotationId]: updated };
      });

      // Cập nhật totalPrice
      const total = quotationServicesList[quotationId].reduce((acc, s, idx) => {
        if (idx === serviceIndex) return acc + newQuantity * s.price.amount;
        return acc + s.subtotal;
      }, 0);
      setQuotations((prev) =>
        prev.map((q) =>
          q.quotationId === quotationId ? { ...q, totalPrice: total } : q
        )
      );
    } catch (err) {
      console.error(err);
      message.error("Cập nhật quantity thất bại!");
    }
  };

  // ===== Columns =====
  const surveyColumns = [
    { title: "ID", dataIndex: "surveyId", key: "surveyId" },
    { title: "Khách hàng gửi yêu cầu", dataIndex: "username" },
    { title: "Công ty khách hàng", dataIndex: "companyName" },
    { title: "Địa chỉ từ", dataIndex: "addressFrom", key: "addressFrom" },
    { title: "Địa chỉ đến", dataIndex: "addressTo", key: "addressTo" },
    { title: "Số CN ước tính", dataIndex: "estimatedWorkers", key: "estimatedWorkers" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "DONE" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Ngày khảo sát",
      dataIndex: "surveyDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khảo sát này?"
            onConfirm={() => handleDelete(record.surveyId)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const quoteColumns = [
    { title: "Mã báo giá", dataIndex: "quotationId" },
    { title: "Khảo sát từ khách hàng", dataIndex: "username" },
    { title: "Thuộc công ty (Nếu có)", dataIndex: "companyName" },
    { title: "Địa điểm bắt đầu", dataIndex: "addressFrom" },
    { title: "Địa điểm khách yêu cầu chuyển đến", dataIndex: "addressTo" },
    {
      title: "Tổng giá (VNĐ)",
      dataIndex: "totalPrice",
      render: (value) => value?.toLocaleString(),
    },
    { title: "Ngày tạo", dataIndex: "createdDate", render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm") },
    {
      title: "Chọn dịch vụ cho khách hàng",
      render: (_, record) => {
        const data = quotationServiceForm[record.quotationId] || {};
        const selectedService = serviceList.find(s => s.serviceId === Number(data.serviceId));
        const prices = selectedService?.prices || [];
        const quantity = data.quantity || 0;
        const servicesAdded = quotationServicesList[record.quotationId] || [];

        const changeQuantity = (delta) => {
          handleQuotationServiceChange(record.quotationId, "quantity", Math.max(0, quantity + delta));
        };

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Select
              placeholder="Chọn Service"
              value={data.serviceId}
              onChange={(val) => handleQuotationServiceChange(record.quotationId, "serviceId", val)}
              style={{ width: 180 }}
            >
              {serviceList.map(s => (
                <Option key={s.serviceId} value={s.serviceId}>{s.serviceName}</Option>
              ))}
            </Select>

            {prices.length > 0 && (
              <Select
                placeholder="Chọn Price"
                value={data.priceId}
                onChange={(val) => handleQuotationServiceChange(record.quotationId, "priceId", val)}
                style={{ width: 180 }}
              >
                {prices.map(p => (
                  <Option key={p.priceId} value={p.priceId}>
                    {p.priceType} - {p.amount.toLocaleString()}
                  </Option>
                ))}
              </Select>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Button size="small" onClick={() => changeQuantity(-1)}>-</Button>
              <span>{quantity}</span>
              <Button size="small" onClick={() => changeQuantity(1)}>+</Button>
            </div>

            <Button
              type="primary"
              size="small"
              onClick={() => handleCreateQuotationService(record.quotationId)}
            >
              Thêm
            </Button>

            {/* List services added cho quotation */}
            <div>
              {servicesAdded.map((s, idx) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  <span>{s.service.serviceName} - {s.price.amount.toLocaleString()} x {s.quantity}</span>
                  <div>
                    <Button size="small" onClick={() => handleQuantityChange(record.quotationId, idx, -1)}>-</Button>
                    <Button size="small" onClick={() => handleQuantityChange(record.quotationId, idx, 1)}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} theme="light">
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={(e) => setActiveMenu(e.key)}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="survey" icon={<FileAddOutlined />}>Quản lý Khảo Sát</Menu.Item>
          <Menu.Item key="quotation" icon={<DollarOutlined />}>Quản lý Báo Giá</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "20px" }}>
        <Content>
          <h2 style={{ marginBottom: 20 }}>{activeMenu === "survey" ? "Quản lý Khảo Sát" : "Quản lý Báo Giá"}</h2>

          {activeMenu === "survey" && (
            <>
              <Card title="Tạo khảo sát mới" style={{ marginBottom: 30 }}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Form.Item
                    name="requestId"
                    label="Chọn Request"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Chọn request"
                      onChange={(val) => {
                        const req = requests.find((r) => r.requestId === val);
                        setSelectedRequest(req);
                        form.setFieldsValue({ requestId: req?.requestId });
                      }}
                    >
                      {requests.map((r) => (
                        <Option key={r.requestId} value={r.requestId}>
                          {r.requestId} - {r.username} ({r.companyName})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {selectedRequest && (
                    <div style={{ marginBottom: 10 }}>
                      <p>Username: {selectedRequest.username}</p>
                      <p>Company: {selectedRequest.companyName}</p>
                    </div>
                  )}

                  <Form.Item name="surveyDate" label="Ngày khảo sát" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} showTime />
                  </Form.Item>

                  <Form.Item name="addressFrom" label="Địa chỉ bắt đầu" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item name="addressTo" label="Địa chỉ đến" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item name="estimatedWorkers" label="Số công nhân ước tính" rules={[{ required: true }]}>
                    <InputNumber min={1} max={50} style={{ width: "100%" }} />
                  </Form.Item>

                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                    Tạo khảo sát
                  </Button>
                </Form>
              </Card>

              <Card title="Danh sách khảo sát">
                <Table dataSource={surveys} columns={surveyColumns} rowKey="surveyId" loading={loading} bordered />
              </Card>
            </>
          )}

          {activeMenu === "quotation" && (
            <>
              <Card title="Tạo Báo Giá Mới" style={{ marginBottom: 30 }}>
                <Form form={quoteForm} layout="vertical" onFinish={handleCreateQuotation}>
                  <Form.Item name="surveyId" label="Chọn Survey (DONE)" rules={[{ required: true }]}>
                    <Select placeholder="Chọn khảo sát đã hoàn thành">
                      {surveys.filter((s) => s.status === "DONE").map((s) => (
                        <Option key={s.surveyId} value={s.surveyId}>
                          #{s.surveyId} - {s.username} ({s.addressFrom} → {s.addressTo})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                

                  <Form.Item name="createdDate" label="Ngày tạo báo giá" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} showTime />
                  </Form.Item>

                  <Button type="primary" htmlType="submit" icon={<DollarOutlined />}>
                    Tạo Báo Giá
                  </Button>
                </Form>
              </Card>

              <Card title="Danh sách báo giá">
                <Table dataSource={quotations} columns={quoteColumns} rowKey="quotationId" bordered />
              </Card>
            </>
          )}

          <Modal
            title="Chỉnh sửa khảo sát"
            open={editModalVisible}
            onOk={handleUpdate}
            onCancel={() => setEditModalVisible(false)}
          >
            <Form form={editForm} layout="vertical">
              <Form.Item name="surveyDate" label="Ngày khảo sát" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} showTime />
              </Form.Item>
              <Form.Item name="addressFrom" label="Địa chỉ bắt đầu" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="addressTo" label="Địa chỉ đến" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="estimatedWorkers" label="Số công nhân ước tính" rules={[{ required: true }]}>
                <InputNumber min={1} max={50} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái">
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SurveyDashboard;
