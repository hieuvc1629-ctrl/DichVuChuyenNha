import React, { useEffect, useState } from "react";
import axios from "axios";

const UserContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy token và userId từ localStorage (giả sử login lưu token và userId)
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  console.log("không có userid",userId)
  console.log("userId:", userId); // phải là 9

   // bạn cần lưu userId khi login

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/contracts/unsigned/${userId}`, {
             headers: { Authorization: `Bearer ${token}` },

        });
        
        setContracts(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch contracts");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchContracts();
  }, [userId, token]);

  const handleSign = async (contractId) => {
    if (!window.confirm("Bạn có chắc chắn muốn ký hợp đồng này?")) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/contracts/sign/${userId}/${contractId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Ký hợp đồng thành công!");
      // Cập nhật lại danh sách hợp đồng unsigned
      setContracts(contracts.filter((c) => c.contractId !== contractId));
    } catch (err) {
      console.error(err);
      alert("Ký hợp đồng thất bại");
    }
  };

  if (loading) return <div>Loading contracts...</div>;

  if (!contracts.length)
    return <div>Bạn không có hợp đồng nào cần ký.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Danh sách hợp đồng chưa ký</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Start Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>End Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Deposit</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.contractId}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{contract.contractId}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{contract.startDate}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{contract.endDate}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{contract.depositAmount}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{contract.totalAmount}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button
                  onClick={() => handleSign(contract.contractId)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#8B0000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Tôi đồng ý
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserContractsPage;
