import React from "react";
import { Table, Button, Tag, Popconfirm, Space, Typography, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

export const SurveyList = ({ surveys, loading, onEdit, onDelete, onCreateQuotation }) => {
  const columns = [
    {
      title: "ID KS",
      dataIndex: "surveyId",
      key: "surveyId",
      width: 90,
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
      title: "Địa chỉ di chuyển",
      key: "addresses",
      render: (_, record) => (
        <div>
          <Text type="secondary" style={{ fontSize: '0.9em' }}>
            <EnvironmentOutlined style={{ marginRight: 4, color: '#52c41a' }} />
            **Từ**: {record.addressFrom}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '0.9em' }}>
            <EnvironmentOutlined style={{ marginRight: 4, color: '#faad14' }} />
            **Đến**: {record.addressTo}
          </Text>
        </div>
      ),
    },
    {
      title: "Thông số KS",
      key: "details",
      width: 150,
      render: (_, record) => (
        <div>
          <Text>
            <UserOutlined style={{ marginRight: 4 }} />
            CN: {record.estimatedWorkers}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '0.9em' }}>
            {record.surveyDate ? dayjs(record.surveyDate).format("DD/MM/YYYY") : "Chưa có ngày"}
          </Text>
        </div>
      ),
    },
    {
      title: "Dịch vụ bổ sung",
      dataIndex: "listService",
      key: "listService",
      render: (listService) => (
        <Tooltip title={listService || "Không có dịch vụ bổ sung"}>
          <Text ellipsis style={{ maxWidth: 150 }}>
            {listService || "-"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status) => {
        let color = status === "DONE" ? "success" : "processing";
        return <Tag color={color} icon={<CheckCircleOutlined />}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<DollarOutlined />}
            onClick={() => onCreateQuotation(record)}
          >
            Tạo Báo Giá
          </Button>

          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>

          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa khảo sát này không?"
            onConfirm={() => onDelete(record.surveyId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} /> {/* Xóa gọn */}
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={surveys}
      columns={columns}
      rowKey={(record) => record.surveyId ?? record.id ?? Math.random()}
      bordered={false} // Bỏ border để trông hiện đại hơn
      loading={loading}
      pagination={{ pageSize: 5 }} // Giới hạn số lượng hiển thị
      size="middle"
      scroll={{ x: 'max-content' }}
    />
  );
};