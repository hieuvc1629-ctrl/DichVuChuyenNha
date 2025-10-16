import React, { useEffect, useState } from "react";
import { Modal, Select, InputNumber, Button, Row, Col, Card, message } from "antd";
import axiosInstance from "../service/axiosInstance";

const AddServiceModal = ({ open, quotation, onClose, onSuccess }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) fetchServices();
  }, [open]);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("/prices");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải danh sách dịch vụ!");
    }
  };

  const handleAdd = async () => {
    if (!selectedService || !selectedPrice || !quantity) {
      message.warning("Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    try {
      await axiosInstance.post("/quotation-services", {
        quotationId: quotation.quotationId,
        serviceId: selectedService.serviceId,
        priceId: selectedPrice.priceId,
        quantity,
      });

      message.success("Thêm dịch vụ thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Không thể thêm dịch vụ!");
    }
  };

  return (
    <Modal
      open={open}
      title={`Thêm dịch vụ cho báo giá ${quotation?.quotationId}`}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Row gutter={[16, 16]}>
        {services.map((s) => (
          <Col span={12} key={s.serviceId}>
            <Card
              hoverable
              cover={
                <img
                  alt={s.serviceName}
                  src={s.imageUrl}
                  style={{
                    height: 150,
                    objectFit: "cover",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
              }
              onClick={() => setSelectedService(s)}
              style={{
                border:
                  selectedService?.serviceId === s.serviceId
                    ? "2px solid #8B0000"
                    : "1px solid #ddd",
              }}
            >
              <h3>{s.serviceName}</h3>
              <p>{s.description}</p>

              {selectedService?.serviceId === s.serviceId && (
                <>
                  <Select
                    style={{ width: "100%", marginBottom: 8 }}
                    placeholder="Chọn loại giá"
                    onChange={(value) => {
                      const price = s.prices.find((p) => p.priceId === value);
                      setSelectedPrice(price);
                    }}
                  >
                    {s.prices.map((p) => (
                      <Select.Option key={p.priceId} value={p.priceId}>
                        {p.priceType} - {p.amount.toLocaleString()}₫
                      </Select.Option>
                    ))}
                  </Select>

                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={setQuantity}
                    style={{ width: "100%", marginBottom: 8 }}
                  />

                  <Button type="primary" block onClick={handleAdd}>
                    Thêm dịch vụ
                  </Button>
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default AddServiceModal;
