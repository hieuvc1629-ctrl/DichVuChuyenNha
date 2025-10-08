import React, { useEffect, useState } from "react";
import { Table, Card, Spin, Input, message, InputNumber, Popconfirm, Button } from "antd";
import axios from "axios";

const { Search } = Input;

const QuotationServiceList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/quotation-services");
      setData(res.data);
    } catch (error) {
      console.error(error);
      message.error("Lấy danh sách dịch vụ thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = searchText
    ? data.filter(item => item.username.toLowerCase().includes(searchText.toLowerCase()))
    : data;

  // Cập nhật quantity
  const handleQuantityChange = async (id, value) => {
    try {
      await axios.put(`http://localhost:8080/api/quotation-services/${id}?quantity=${value}`);
      message.success("Cập nhật quantity thành công");
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại");
    }
  };

  // Xóa dịch vụ
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/quotation-services/${id}`);
      message.success("Xóa dịch vụ thành công");
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "Service Name", dataIndex: "serviceName", key: "serviceName" },
    { title: "Price Type", dataIndex: "priceType", key: "priceType" },
    { 
      title: "Quantity", 
      dataIndex: "quantity", 
      key: "quantity",
      render: (value, record) => (
        <InputNumber 
          min={1} 
          value={value} 
          onChange={(val) => handleQuantityChange(record.id, val)} 
        />
      )
    },
    { 
      title: "Subtotal", 
      dataIndex: "subtotal", 
      key: "subtotal", 
      render: v => `$${v.toFixed(2)}` 
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="Quotation Services" style={{ margin: 20 }}>
      <Search
        placeholder="Tìm theo username"
        allowClear
        enterButton="Search"
        size="middle"
        style={{ marginBottom: 16, width: 300 }}
        onSearch={value => setSearchText(value)}
      />

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </Card>
  );
};

export default QuotationServiceList;
