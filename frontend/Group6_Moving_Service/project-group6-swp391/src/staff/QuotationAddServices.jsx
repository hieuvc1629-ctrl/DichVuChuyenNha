import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axiosInstance from "../service/axiosInstance";
import AddServiceModal from "./AddServiceModal";

const QuotationAddServices = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchQuotations = async () => {
    try {
      const res = await axiosInstance.get("/quotations/me");
      setQuotations(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách báo giá!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const columns = [
    { title: "Mã báo giá", dataIndex: "quotationId", key: "id" },
    { title: "Tổng giá", dataIndex: "totalPrice", key: "totalPrice" },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedQuotation(record);
            setOpen(true);
          }}
        >
          Thêm dịch vụ
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={quotations}
        rowKey="quotationId"
        loading={loading}
      />
      <AddServiceModal
        open={open}
        quotation={selectedQuotation}
        onClose={() => setOpen(false)}
        onSuccess={fetchQuotations}
      />
    </>
  );
};

export default QuotationAddServices;
