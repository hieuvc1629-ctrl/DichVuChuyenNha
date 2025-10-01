import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Tabs,
  message,
} from "antd";
import axios from "axios";

const { TabPane } = Tabs;

const ManagerDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal tạo contract
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [form] = Form.useForm();

  // Modal chi tiết contract
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // State cho ContractAssignment tab
  const [employees, setEmployees] = useState([]);
  const [selectedContractAssign, setSelectedContractAssign] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [assignMessage, setAssignMessage] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/manager/contracts"
        );
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

    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/employees");
        setEmployees(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployees([]);
      }
    };

    fetchContracts();
    fetchEmployees();
  }, []);

  // Modal tạo contract
  const openCreateModal = (quotationId) => {
    setSelectedQuotationId(quotationId);
    form.resetFields();
    setCreateModalVisible(true);
  };

  const handleCreateContract = async (values) => {
    try {
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
                  totalAmount: data.result.totalAmount,
                }
              : c
          )
        );
        setCreateModalVisible(false);
      } else {
        message.error(data.message || "Failed to create contract");
      }
    } catch (err) {
      message.error(err.message || "Error creating contract");
    }
  };

  // Modal chi tiết contract
  const openDetailModal = (record) => {
    setSelectedContract(record);
    setDetailModalVisible(true);
  };

  // Contract table
  const contractColumns = [
    { title: "Request ID", dataIndex: "requestId", key: "requestId" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    {
      title: "Contract Status",
      dataIndex: "contractStatus",
      key: "contractStatus",
      render: (_, record) => record.contractStatus || "Not created",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {!record.contractId && (
            <Button
              type="primary"
              onClick={() => openCreateModal(record.quotationId)}
              style={{ marginRight: 8 }}
            >
              Create Contract
            </Button>
          )}
          <Button onClick={() => openDetailModal(record)}>View Details</Button>
        </>
      ),
    },
  ];

  // Handle Assign Employee
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedContractAssign || !selectedEmployee || !assignedDate) {
      setAssignMessage("Please fill all fields!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/api/assignments", {
        contractId: parseInt(selectedContractAssign),
        employeeId: parseInt(selectedEmployee),
        assignedTime: assignedDate,
      });
      setAssignMessage(`Assigned successfully! Assignment ID: ${res.data.id}`);
      setSelectedContractAssign("");
      setSelectedEmployee("");
      setAssignedDate("");
    } catch (err) {
      console.error(err);
      setAssignMessage(err.response?.data?.message || "Error assigning employee");
    }
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <Tabs defaultActiveKey="1">
        {/* Tab 1: Contracts */}
        <TabPane tab="Contracts" key="1">
          <Table
            dataSource={contracts}
            columns={contractColumns}
            rowKey={(record) => record.quotationId}
            loading={loading}
          />
        </TabPane>

        {/* Tab 2: Assign Employees */}
        <TabPane tab="Assign Employees" key="2">
          <div style={{ padding: "20px", maxWidth: "600px" }}>
            <h3>Assign Employee to Contract</h3>
            <form
              onSubmit={handleAssign}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div>
                <label>Contract:</label>
                <select
                  value={selectedContractAssign}
                  onChange={(e) => setSelectedContractAssign(e.target.value)}
                  required
                >
                  <option value="">-- Select contract --</option>
                  {contracts
                    .filter((c) => c.contractId)
                    .map((c) => (
                      <option key={c.contractId} value={c.contractId}>
                        {c.contractId} - {c.contractStatus || "No status"}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label>Employee:</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  required
                >
                  <option value="">-- Select employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.username || "No username"} - {emp.position || "No position"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Assigned Date:</label>
                <input
                  type="date"
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit">Assign</button>
            </form>
            {assignMessage && (
              <p style={{ marginTop: "10px", color: "green" }}>{assignMessage}</p>
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Modal tạo contract */}
      <Modal
        title="Create Contract"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        okText="Create"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateContract}>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="depositAmount"
            label="Deposit Amount"
            rules={[{ required: true, message: "Please input deposit amount" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="totalAmount"
            label="Total Amount"
            rules={[{ required: true, message: "Please input total amount" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết contract */}
      <Modal
        title="Contract Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedContract && (
          <div>
            <p>
              <b>Request ID:</b> {selectedContract.requestId}
            </p>
            <p>
              <b>Description:</b> {selectedContract.requestDescription}
            </p>
            <p>
              <b>Customer:</b> {selectedContract.customerName}
            </p>
            <p>
              <b>Email:</b> {selectedContract.customerEmail}
            </p>
            <p>
              <b>Phone:</b> {selectedContract.customerPhone}
            </p>
            <p>
              <b>Company:</b> {selectedContract.customerCompanyName}
            </p>
            <p>
              <b>Survey:</b> {selectedContract.addressFrom} → {selectedContract.addressTo}
            </p>
            <p>
              <b>Survey Date:</b> {selectedContract.surveyDate}
            </p>
            <p>
              <b>Survey Status:</b> {selectedContract.surveyStatus}
            </p>
            <p>
              <b>Quotation Total:</b> {selectedContract.totalPrice}
            </p>
            <p>
              <b>Contract Status:</b> {selectedContract.contractStatus || "Not created"}
            </p>
            <p>
              <b>Signed By:</b> {selectedContract.signedBy || "-"}
            </p>

            <h4>Quotation Services</h4>
            <ul>
              {selectedContract.quotationServices?.map((qs, idx) => (
                <li key={idx}>
                  {qs.serviceName} - {qs.price}
                </li>
              ))}
            </ul>

            <h4>Vehicles</h4>
            <ul>
              {selectedContract.vehicles?.map((v, idx) => (
                <li key={idx}>
                  {v.vehicleName} - {v.licensePlate}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerDashboard;
