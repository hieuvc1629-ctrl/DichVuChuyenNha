import React, { useEffect, useState } from "react";
import { Table, Button, Collapse, message, Modal, Form, Input, DatePicker, InputNumber } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Panel } = Collapse;

const ManagerContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/manager/contracts");
        const data = response.data;

        if (data.code === 1000 && data.result) {
          setContracts(data.result);
        } else {
          message.error(data.message || "Failed to fetch contracts");
        }
      } catch (err) {
        message.error(err.message || "Error fetching contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const openCreateModal = (quotationId) => {
    setSelectedQuotationId(quotationId);
    form.resetFields();
    setModalVisible(true);
  };

  const handleCreateContract = async (values) => {
    try {
      // Chuyển ngày sang format 'YYYY-MM-DD' trước khi gửi
      const payload = {
        quotationId: selectedQuotationId,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        depositAmount: values.depositAmount,
        totalAmount: values.totalAmount,
      };

      const response = await axios.post(
        "http://localhost:8080/api/manager/contracts/create",
        payload
      );

      const data = response.data;

      if (data.code === 1000) {
        message.success("Contract created successfully");
        setContracts((prev) =>
          prev.map((c) =>
            c.quotationId === selectedQuotationId
              ? { 
                  ...c, 
                  contractId: data.result.contractId, 
                  contractStatus: data.result.status,
                  startDate: data.result.startDate,
                  endDate: data.result.endDate,
                  depositAmount: data.result.depositAmount,
                  totalAmount: data.result.totalAmount
                }
              : c
          )
        );
        setModalVisible(false);
      } else {
        message.error(data.message || "Failed to create contract");
      }
    } catch (err) {
      message.error(err.message || "Error creating contract");
    }
  };

  const columns = [
    { title: "Request ID", dataIndex: "requestId", key: "requestId" },
    { title: "Request Description", dataIndex: "requestDescription", key: "requestDescription" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    { title: "Email", dataIndex: "customerEmail", key: "customerEmail" },
    { title: "Phone", dataIndex: "customerPhone", key: "customerPhone" },
    { title: "Company", dataIndex: "customerCompanyName", key: "customerCompanyName" },
    { title: "Survey Address", render: (_, record) => `${record.addressFrom} → ${record.addressTo}` },
    { title: "Survey Date", dataIndex: "surveyDate", key: "surveyDate" },
    { title: "Survey Status", dataIndex: "surveyStatus", key: "surveyStatus" },
    { title: "Quotation Total", dataIndex: "totalPrice", key: "totalPrice" },
    { title: "Contract Status", dataIndex: "contractStatus", key: "contractStatus", render: (_, record) => record.contractStatus || "Not created" },
    { title: "Signed By", dataIndex: "signedBy", key: "signedBy", render: (_, record) => record.signedBy || "-" },
    { 
      title: "Action", 
      key: "action", 
      render: (_, record) => (
        !record.contractId ? (
          <Button type="primary" onClick={() => openCreateModal(record.quotationId)}>
            Create Contract
          </Button>
        ) : null
      )
    }
  ];

  return (
    <div>
      <h2>Manager Contracts</h2>
      <Table
        dataSource={contracts}
        columns={columns}
        rowKey={(record) => record.quotationId}
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <Collapse>
              <Panel header="Quotation Services" key="1">
                <ul>
                  {record.quotationServices.map((qs, idx) => (
                    <li key={idx}>{qs.serviceName} - {qs.price}</li>
                  ))}
                </ul>
              </Panel>
              <Panel header="Vehicles" key="2">
                <ul>
                  {record.vehicles.map((v, idx) => (
                    <li key={idx}>{v.vehicleName} - {v.licensePlate}</li>
                  ))}
                </ul>
              </Panel>
            </Collapse>
          )
        }}
      />

      <Modal
        title="Create Contract"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        okText="Create"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateContract}>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: "Please select start date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: "Please select end date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="depositAmount" label="Deposit Amount" rules={[{ required: true, message: "Please input deposit amount" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="totalAmount" label="Total Amount" rules={[{ required: true, message: "Please input total amount" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagerContractsPage;
