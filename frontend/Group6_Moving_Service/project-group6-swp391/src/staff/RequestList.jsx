import React from "react";
import { Table, Button, Tag, Typography, Tooltip } from "antd";
import { PlusOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

export const RequestList = ({ requests, onCreateSurvey }) => {
  const columns = [
    {
      title: "Mã Yêu Cầu",
      dataIndex: "requestId",
      key: "requestId",
      width: 120,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Khách hàng / Công ty",
      key: "client",
      render: (_, record) => (
        <div>
          <Text>{record.username}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '0.9em' }}>{record.companyName}</Text>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "pickupAddress",
      key: "pickupAddress",
      render: (address) => (
        <Tooltip title={address}>
          <Text ellipsis={{ tooltip: address }} style={{ maxWidth: 250 }}>
            <EnvironmentOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {address}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "requestTime",
      key: "requestTime",
      width: 150,
      render: (date) => (
        <Text type="secondary">
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-"}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = status === "PENDING" ? "warning" : "success";
        let text = status === "PENDING" ? "Chờ Khảo Sát" : "Đã Xử Lý";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => {
        const isSurveyed = record.status !== "PENDING"; // Giả định: chỉ tạo KS cho status PENDING
        return (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onCreateSurvey(record)}
            disabled={isSurveyed}
          >
            {isSurveyed ? "Đã Khảo Sát" : "Tạo Khảo Sát"}
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={requests}
      columns={columns}
      rowKey="requestId"
      bordered={false} // Bỏ border để trông hiện đại hơn
      pagination={{ pageSize: 5 }} // Giới hạn số lượng hiển thị
      size="middle"
      scroll={{ x: 'max-content' }}
    />
  );
};