import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spin,
  Select,
  InputNumber,
  message,
  Tag,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

export const QuotationList = ({
  quotations,
  serviceList,
  loadingServices,
  quotationServiceForm,
  quotationServicesList,
  onServiceChange,
  onCreateService,
  onQuantityChange,
  fetchQuotations,
}) => {
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "" });

  const showNotification = (messageText) => {
    setNotification({ show: true, message: messageText });
    setTimeout(() => setNotification({ show: false, message: "" }), 3500);
  };

  const statusColors = {
    APPROVED: "green",
    SENT: "blue",
    DRAFT: "orange",
    REJECTED: "red",
  };

  const statusText = {
    APPROVED: "Đã chấp nhận",
    PENDING: "Đã gửi",
    
    REJECTED: "Từ chối",
  };

  // 🧩 Hiển thị chi tiết báo giá (giữ nguyên logic thêm/xóa/cập nhật)
  const renderQuotationDetails = (record) => {
    if (!record) {
      return (
        <div
          style={{
            height: "75vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontStyle: "italic",
            background: "#fafafa",
            borderRadius: 10,
            border: "1px dashed #ccc",
          }}
        >
          👈 Vui lòng chọn một báo giá để xem chi tiết
        </div>
      );
    }

    const qid = record.quotationId;
    const data = quotationServiceForm[qid] || {};
    const selectedService = serviceList.find(
      (s) => s.serviceId === Number(data.serviceId)
    );
    const prices = selectedService?.prices || [];
    const added = quotationServicesList[qid] || [];
    const quantity = data.quantity || 1;

    const handleAddService = async () => {
      if (!data.serviceId || !data.priceId || quantity < 1) {
        message.warning("Vui lòng chọn dịch vụ, giá và số lượng hợp lệ!");
        return;
      }
      try {
        await onCreateService(qid);
        onServiceChange(qid, "serviceId", undefined);
        onServiceChange(qid, "priceId", undefined);
        onServiceChange(qid, "quantity", 1);
        showNotification("Thêm hoặc cập nhật dịch vụ thành công!");
        fetchQuotations?.();
      } catch (error) {
        console.error("Lỗi khi thêm dịch vụ:", error);
        message.error("Thêm dịch vụ thất bại!");
      }
    };

    const handleUpdateQuantity = async (serviceId, newQuantity) => {
      try {
        await axios.put(
          `http://localhost:8080/api/quotation-services/${serviceId}?quantity=${newQuantity}`
        );
        showNotification("Cập nhật số lượng thành công!");
        fetchQuotations?.();
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        message.error("Cập nhật thất bại!");
      }
    };

    const handleDeleteService = async (serviceId) => {
      try {
        await axios.delete(
          `http://localhost:8080/api/quotation-services/${serviceId}`
        );
        showNotification("Xóa dịch vụ thành công!");
        fetchQuotations?.();
      } catch (error) {
        console.error("Lỗi xóa dịch vụ:", error);
        message.error("Xóa thất bại!");
      }
    };

    return (
      <div style={{ padding: 16 }}>
        {/* Notification */}
        {notification.show && (
          <div
            style={{
              position: "fixed",
              top: "16px",
              right: "16px",
              zIndex: 9999,
              padding: "12px 24px",
              borderRadius: "8px",
              backgroundColor: "#28a745",
              color: "white",
              fontWeight: "500",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {notification.message}
          </div>
        )}

        <h3 style={{ marginBottom: 12 }}>Chi Tiết Báo Giá</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h4>Thông tin khách hàng</h4>
          <Tag color={statusColors[record.status]}>
            {statusText[record.status]}
          </Tag>
        </div>

        <p>
          <strong>Tên:</strong> {record.username}
        </p>
       
       
        <p>
          <strong>Từ:</strong> {record.addressFrom || "N/A"}
        </p>
        <p>
          <strong>Đến:</strong> {record.addressTo || "N/A"}
        </p>
        <p>
          <strong>Ngày chuyển:</strong>{" "}
          {dayjs(record.surveyDate).format("DD/MM/YYYY")}
        </p>
        

        {/* Dịch vụ đã thêm */}
        <h4 style={{ marginTop: 20 }}>Chi tiết dịch vụ</h4>
        {added.length > 0 ? (
          added.map((s) => (
            <div
              key={s?.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <div>
                <strong>{s?.serviceName}</strong>
                <div style={{ color: "#666" }}>
                  ({s?.priceType}) - {s?.amount?.toLocaleString()} ×{" "}
                  {s.quantity} ={" "}
                  <strong>{s.subtotal?.toLocaleString()} đ</strong>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Button
                  size="small"
                  onClick={() => handleUpdateQuantity(s.id, s.quantity - 1)}
                  disabled={s.quantity <= 1}
                >
                  −
                </Button>
                <span>{s.quantity}</span>
                <Button
                  size="small"
                  onClick={() => handleUpdateQuantity(s.id, s.quantity + 1)}
                >
                  +
                </Button>
                <Button
                  danger
                  type="primary"
                  size="small"
                  onClick={() => handleDeleteService(s.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#999", fontStyle: "italic" }}>
            Chưa có dịch vụ nào được thêm.
          </p>
        )}

        {/* Tổng cộng */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "12px 16px",
            marginTop: 16,
            borderRadius: 8,
            textAlign: "right",
          }}
        >
          <strong>Tổng cộng: </strong>
          <span style={{ color: "#1677ff", fontSize: 16 }}>
            {record.totalPrice?.toLocaleString() || 0} đ
          </span>
        </div>
      </div>
    );
  };

  // 🧱 Giao diện chính — 2 cột
  return (
    <Row gutter={24}>
      {/* Cột trái: danh sách báo giá */}
      <Col span={10}>
        <h3 style={{ marginBottom: 16 }}>Danh Sách Báo Giá</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          {quotations.map((q) => (
            <Card
              key={q.quotationId}
              hoverable
              onClick={() => setSelectedQuotation(q)}
              style={{
                border:
                  selectedQuotation?.quotationId === q.quotationId
                    ? "2px solid #1677ff"
                    : "1px solid #ddd",
                background:
                  selectedQuotation?.quotationId === q.quotationId
                    ? "#f0f8ff"
                    : "white",
                borderRadius: 10,
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <strong>{q.quotationCode || q.quotationId}</strong>
                <Tag color={statusColors[q.status]}>
                  {statusText[q.status]}
                </Tag>
              </div>
              <div>{q.username}</div>
              <div>📞 {q.phone}</div>
              <div>📅 {dayjs(q.createdAt).format("DD/MM/YYYY")}</div>
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <strong style={{ color: "#1677ff" }}>
                  {q.totalPrice?.toLocaleString() || 0} đ
                </strong>
              </div>
            </Card>
          ))}
        </div>
      </Col>

      {/* Cột phải: chi tiết báo giá */}
      <Col span={14}>
        {renderQuotationDetails(selectedQuotation)}
      </Col>
    </Row>
  );
};
