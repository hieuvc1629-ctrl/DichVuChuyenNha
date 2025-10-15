// src/service/assignment.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

// Hàm lấy header Authorization nếu có token
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
}

export const assignmentApi = {
  // ✅ Lấy danh sách hợp đồng đã ký (SIGNED) có thể gán nhân viên
  getAssignableContracts: () => {
    return axios.get(`${API_BASE}/contracts`, {
      headers: getAuthHeaders(),
    });
  },

  // ✅ Lấy danh sách nhân viên đang "free"
  getEmployees: () => {
    return axios.get(`${API_BASE}/employees/status/free`, {
      headers: getAuthHeaders(),
    });
  },

  // ✅ Gán 1 nhân viên vào hợp đồng
  assignEmployee: (payload) => {
    // payload = { contractId, employeeId, assignedDate }
    return axios.post(`${API_BASE}/assignments/assign`, payload, {
      headers: getAuthHeaders(),
    });
  },

  // ❓ Tuỳ chọn: Lấy danh sách nhân viên đã được gán cho hợp đồng
  getAssignmentsByContract: (contractId) => {
    return axios.get(`${API_BASE}/assignments/${contractId}`, {
      headers: getAuthHeaders(),
    });
  },

  // ❓ Tuỳ chọn: Xoá 1 assignment nếu cần
  removeAssignment: (contractId, employeeId) => {
    return axios.delete(`${API_BASE}/assignments/${contractId}/${employeeId}`, {
      headers: getAuthHeaders(),
    });
  },
};

export default assignmentApi;
