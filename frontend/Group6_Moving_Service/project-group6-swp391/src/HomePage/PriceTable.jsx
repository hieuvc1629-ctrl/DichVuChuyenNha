import React, { useEffect, useState } from "react";
import { Table, Card, Spin, message } from "antd";
import axios from "axios";

const PriceTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/prices")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        message.error("Không thể tải dữ liệu bảng giá");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin style={{ marginTop: "100px" }} />;

  return (
    <div style={{ padding: "30px", background: "#fafafa" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        BẢNG GIÁ DỊCH VỤ
      </h2>

      {data.map((service) => (
        <Card
          key={service.serviceId}
          title={
            <div>
              <strong>{service.serviceName}</strong>
              <div style={{ fontSize: "13px", color: "#777" }}>
                {service.description}
              </div>
            </div>
          }
          style={{ marginBottom: "24px" }}
        >
          <Table
            bordered
            pagination={false}
            dataSource={service.prices}
            rowKey="priceId"
            columns={[
              {
                title: "Loại giá",
                dataIndex: "priceType",
                key: "priceType",
              },
              {
                title: "Đơn giá",
                dataIndex: "amount",
                key: "amount",
                render: (amount) => amount.toLocaleString("vi-VN") + " ₫",
              },
              
            ]}
          />
        </Card>
      ))}
    </div>
  );
};

export default PriceTable;
