// src/api/contract.js
import api from "./api";
import ENDPOINTS from "./endpoint";

const ContractAPI = {
  getById: async (id) => {
    const res = await api.get(ENDPOINTS.CONTRACT.GET_BY_ID(id));
    return res.data;
  },

  signContract: async (id, userId) => {
    // gửi userId qua query param thay vì body
    const res = await api.put(`${ENDPOINTS.CONTRACT.SIGN(id)}?userId=${userId}`);
    return res.data;
  },
};

export default ContractAPI;
