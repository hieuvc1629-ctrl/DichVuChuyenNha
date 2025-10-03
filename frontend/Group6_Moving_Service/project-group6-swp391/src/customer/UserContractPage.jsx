import React, { useEffect, useState } from "react";
import axios from "axios";

const UserContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch contracts của user đang login
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/contracts/unsigned/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContracts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch contracts");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchContracts();
  }, [token]);

  // Sign contract
  const handleSign = async (contractId) => {
    if (!agreeTerms) {
      alert("Bạn cần đồng ý các điều khoản trước khi ký!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/contracts/sign/${contractId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Ký hợp đồng thành công!");
      setContracts(contracts.filter((c) => c.contractId !== contractId));
      setSelectedContract(null);
      setAgreeTerms(false);
    } catch (err) {
      console.error(err);
      alert("Ký hợp đồng thất bại");
    }
  };

  if (loading) return <div>Loading contracts...</div>;
  if (!contracts.length) return <div>Bạn không có hợp đồng nào cần ký.</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      <h2>Danh sách hợp đồng chưa ký</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Start Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>End Date</th>
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
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{contract.totalAmount}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button
                  onClick={() => setSelectedContract(contract)}
                  style={{ marginRight: "5px" }}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal / Form Chi tiết hợp đồng */}
      {selectedContract && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "600px", maxHeight: "90%", overflowY: "auto" }}>
            <h3>Chi tiết hợp đồng #{selectedContract.contractId}</h3>
            <p><strong>Start Date:</strong> {selectedContract.startDate}</p>
            <p><strong>End Date:</strong> {selectedContract.endDate}</p>
            <p><strong>Deposit:</strong> {selectedContract.depositAmount}</p>
            <p><strong>Total:</strong> {selectedContract.totalAmount}</p>
            <p><strong>Start Location:</strong> {selectedContract.startLocation}</p>
            <p><strong>End Location:</strong> {selectedContract.endLocation}</p>
            <p><strong>Assigned Employees:</strong> {selectedContract.assignedEmployees?.length
                ? selectedContract.assignedEmployees.map((e) => `${e.username} (${e.position})`).join(", ")
                : "Chưa có nhân viên"}
            </p>

            <div style={{ marginTop: "15px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ marginRight: "5px" }}
                />
                Tôi đồng ý với các điều khoản
              </label>
            </div>

            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() => handleSign(selectedContract.contractId)}
                disabled={!agreeTerms}
                style={{
                  padding: "5px 15px",
                  backgroundColor: agreeTerms ? "#8B0000" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: agreeTerms ? "pointer" : "not-allowed",
                  marginRight: "10px",
                }}
              >
                Chấp nhận
              </button>
              <button
                onClick={() => { setSelectedContract(null); setAgreeTerms(false); }}
                style={{
                  padding: "5px 15px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContractsPage;
