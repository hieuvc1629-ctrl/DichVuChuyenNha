import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, InputNumber, Table, Tag, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const SurveyDashboard = () => {
  const [form] = Form.useForm();
  const [surveys, setSurveys] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all surveys
  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/surveys");
      setSurveys(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách khảo sát");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách request");
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchSurveys();
  }, []);

  // Handle submit form
  const handleSubmit = async (values) => {
    try {
      const payload = {
        requestId: values.requestId,
        surveyDate: values.surveyDate.format("YYYY-MM-DDTHH:mm:ss"),
        addressFrom: values.addressFrom,
        addressTo: values.addressTo,
        estimatedWorkers: values.estimatedWorkers,
        status: "PENDING",
      };
const res = await axios.post("http://localhost:8080/api/surveys", payload);
// Thêm survey mới vào state luôn để table tự cập nhật
setSurveys(prev => [...prev, res.data]);
message.success("Tạo khảo sát thành công!");
form.resetFields();
setSelectedRequest(null);
    } catch (error) {
      console.error(error);
      message.error("Có lỗi khi tạo khảo sát!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "surveyId", key: "surveyId" },
    { title: "Request ID", dataIndex: "requestId", key: "requestId" },
    { title: "Khách hàng", dataIndex: "username", key: "username" },
    { title: "Công ty", dataIndex: "companyName", key: "companyName" },
    {
      title: "Ngày khảo sát",
      dataIndex: "surveyDate",
      key: "surveyDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    { title: "Từ", dataIndex: "addressFrom", key: "addressFrom" },
    { title: "Đến", dataIndex: "addressTo", key: "addressTo" },
    { title: "Số công nhân", dataIndex: "estimatedWorkers", key: "estimatedWorkers" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "DONE" ? "green" : "orange"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h2>Survey Dashboard</h2>

      {/* Form tạo survey */}
      <div style={{ marginBottom: 30, padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3>Tạo khảo sát mới</h3>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="requestId" label="Chọn Request" rules={[{ required: true }]}>
            <select
              onChange={(e) => {
                const req = requests.find(r => r.requestId === +e.target.value);
                setSelectedRequest(req);
                form.setFieldsValue({ requestId: req.requestId });
              }}
            >
              <option value="">-- Chọn Request --</option>
              {requests.map(r => (
                <option key={r.requestId} value={r.requestId}>
                  {r.requestId} - {r.username} ({r.companyName})
                </option>
              ))}
            </select>
          </Form.Item>

          {selectedRequest && (
            <div style={{ marginBottom: 10 }}>
              <p>Username: {selectedRequest.username}</p>
              <p>Company: {selectedRequest.companyName}</p>
            </div>
          )}

          <Form.Item name="surveyDate" label="Ngày khảo sát" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} defaultValue={dayjs()} showTime />
          </Form.Item>

          <Form.Item name="addressFrom" label="Địa chỉ bắt đầu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="addressTo" label="Địa chỉ đến" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="estimatedWorkers"
            label="Số công nhân ước tính"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={50} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo khảo sát
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Danh sách survey */}
      <Table
        dataSource={surveys}
        columns={columns}
        rowKey="surveyId"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default SurveyDashboard;
