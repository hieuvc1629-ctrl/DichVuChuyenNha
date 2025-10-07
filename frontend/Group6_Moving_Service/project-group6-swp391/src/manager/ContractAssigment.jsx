import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ContractAssignment() {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [message, setMessage] = useState("");

  // Load contracts và employees
  useEffect(() => {
    // Lấy hợp đồng
    axios.get("http://localhost:8080/api/contracts")
      .then(res => {
        // đảm bảo là mảng
        setContracts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error fetching contracts:", err);
        setContracts([]);
      });

    // Lấy nhân viên
    axios.get("http://localhost:8080/api/employees")
      .then(res => {
        setEmployees(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error fetching employees:", err);
        setEmployees([]);
      });
  }, []);

  // Gán nhân viên
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedContract || !selectedEmployee || !assignedDate) {
      setMessage("Please fill all fields!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/assignments", {
        contractId: parseInt(selectedContract),
        employeeId: parseInt(selectedEmployee),
        assignedTime: assignedDate
      });
      setMessage(`Assigned successfully! Assignment ID: ${res.data.id}`);
      // reset form
      setSelectedContract("");
      setSelectedEmployee("");
      setAssignedDate("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error assigning employee");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Assign Employee to Contract</h2>

      <form onSubmit={handleAssign} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label>Contract:</label>
          <select
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
            required
          >
            <option value="">-- Select contract --</option>
            {(Array.isArray(contracts) ? contracts : []).map(c => (
              <option key={c.contractId} value={c.contractId}>
                {c.contractId} - {c.status}
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
            {(Array.isArray(employees) ? employees : []).map(emp => (
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

      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
    </div>
  );
}
