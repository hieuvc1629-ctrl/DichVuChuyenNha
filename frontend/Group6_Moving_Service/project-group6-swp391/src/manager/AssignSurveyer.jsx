import { useEffect, useState } from "react";
import axios from "axios";

export default function AssignSurveyer() {
  const [requests, setRequests] = useState([]);
  const [surveyers, setSurveyers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({}); // lưu employeeId cho mỗi request

  useEffect(() => {
    // Lấy danh sách requests (sửa theo API trả ApiResponse hay List)
    axios.get("http://localhost:8080/api/requests") // nếu dùng /my => axios.get("/api/requests/my")
      .then(res => {
        // Nếu backend trả ApiResponse { result: [...] }
        const data = res.data.result || res.data;
        setRequests(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));

    // Lấy danh sách surveyer free
    axios.get("http://localhost:8080/api/request-assignment/free-surveyers")
      .then(res => {
        setSurveyers(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error(err));
  }, []);

  const handleAssign = (requestId) => {
    const employeeId = selectedEmployee[requestId];
    if (!employeeId) {
      alert("Chọn nhân viên khảo sát trước khi gán!");
      return;
    }

    axios.post(`http://localhost:8080/api/request-assignment/assign?requestId=${requestId}&employeeId=${employeeId}`)
      .then(res => {
        alert(`Request ${requestId} đã được gán nhân viên ${employeeId}`);
        // update list surveyer free sau khi gán
        return axios.get("/api/request-assignment/free-surveyers");
      })
      .then(res => setSurveyers(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách Request</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Company</th>
            <th>Time</th>
            <th>Status</th>
            <th>Assign Surveyer</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(requests) && requests.length > 0 ? requests.map(r => (
            <tr key={r.requestId}>
              <td>{r.requestId}</td>
              <td>{r.username}</td>
              <td>{r.companyName}</td>
              <td>{r.requestTime}</td>
              <td>{r.status}</td>
              <td>
                <select
                  value={selectedEmployee[r.requestId] || ""}
                  onChange={e => setSelectedEmployee(prev => ({ ...prev, [r.requestId]: e.target.value }))}
                >
                  <option value="">--Chọn Surveyer--</option>
                  {surveyers.map(s => (
                    <option key={s.employeeId} value={s.employeeId}>
                      {s.employeeId} - {s.username} - {s.position}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleAssign(r.requestId)}>Gán</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>Không có Request nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
