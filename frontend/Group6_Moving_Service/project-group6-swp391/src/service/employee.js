import api from './axiosInstance';

const EMPLOYEE_API_BASE = '/api/employees';

export const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await api.get(EMPLOYEE_API_BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Get employee by ID
  getEmployeeById: async (employeeId) => {
    try {
      const response = await api.get(`${EMPLOYEE_API_BASE}/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  // Get employee detail with contract history
  getEmployeeDetail: async (employeeId) => {
    try {
      const response = await api.get(`${EMPLOYEE_API_BASE}/${employeeId}/detail`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee detail:', error);
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await api.put(`${EMPLOYEE_API_BASE}/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.delete(`${EMPLOYEE_API_BASE}/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Get employees by status
  getEmployeesByStatus: async (status) => {
    try {
      const response = await api.get(`${EMPLOYEE_API_BASE}/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees by status:', error);
      throw error;
    }
  },

  // Get employees by position
  getEmployeesByPosition: async (position) => {
    try {
      const response = await api.get(`${EMPLOYEE_API_BASE}/position/${position}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees by position:', error);
      throw error;
    }
  }
};
