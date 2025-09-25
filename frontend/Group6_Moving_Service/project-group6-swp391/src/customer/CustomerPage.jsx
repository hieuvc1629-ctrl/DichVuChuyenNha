import React from 'react'
import { useNavigate } from "react-router-dom";

const CustomerPage = () => {
      const navigate = useNavigate();
    
  return (
    <div><div style={{ marginTop: "15px", textAlign: "center" }}>
  <span>Xem hợp đồng của tôi? </span>
  <button
    type="button"
    onClick={() => navigate("/list-contract-unsigned")}
    style={{
      background: "none",
      border: "none",
      color: "#8B0000",
      cursor: "pointer",
      textDecoration: "underline"
    }}
  >
    Đi tới hợp đồng
  </button>
</div>
</div>
  )
}

export default CustomerPage