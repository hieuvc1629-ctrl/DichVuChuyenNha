import React, { useEffect, useState } from "react";
import workProgressApi from "../service/workprogress";
import "./WorkProgressPage.css";

const WorkProgressPage = () => {
  const [progressList, setProgressList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Lấy danh sách ban đầu
  const fetchProgressList = async () => {
    try {
      setLoading(true);
      const res = await workProgressApi.getMyList();
      setProgressList(res.data);
      setFilteredList(res.data);
    } catch (err) {
      console.error(err);
      setError("❌ Không thể tải danh sách tiến độ. Vui lòng đăng nhập lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressList();
  }, []);

  // ✅ Tìm kiếm theo tên khách hàng hoặc dịch vụ
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredList(progressList);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = progressList.filter(
      (wp) =>
        wp.customerName?.toLowerCase().includes(lower) ||
        wp.serviceName?.toLowerCase().includes(lower) ||
        wp.employeeName?.toLowerCase().includes(lower)
    );
    setFilteredList(filtered);
  }, [searchTerm, progressList]);

  // ✅ Cập nhật local state thay vì fetch lại (tránh giựt)
  const updateWorkProgress = async (progressId, newStatus, newDesc) => {
    try {
      await workProgressApi.update(progressId, {
        progressStatus: newStatus,
        taskDescription: newDesc,
      });

      setProgressList((prevList) =>
        prevList.map((item) =>
          item.progressId === progressId
            ? {
                ...item,
                progressStatus: newStatus,
                taskDescription: newDesc,
                updatedAt: new Date().toISOString(),
                highlight: true,
              }
            : item
        )
      );

      setTimeout(() => {
        setProgressList((prevList) =>
          prevList.map((item) =>
            item.progressId === progressId
              ? { ...item, highlight: false }
              : item
          )
        );
      }, 1000);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật tiến độ:", err);
      alert("Không thể cập nhật tiến độ. Vui lòng thử lại.");
    }
  };

  const handleStatusChange = (progressId, newStatus) => {
    const current = progressList.find((p) => p.progressId === progressId);
    if (current) updateWorkProgress(progressId, newStatus, current.taskDescription);
  };

  const handleDescriptionChange = (progressId, newDesc) => {
    const current = progressList.find((p) => p.progressId === progressId);
    if (current) updateWorkProgress(progressId, current.progressStatus, newDesc);
  };

  if (loading) return <p className="loading">⏳ Đang tải tiến độ...</p>;
  if (error) return <p className="error">{error}</p>;

  // 📊 Thống kê nhanh
  const total = filteredList.length;
  const completed = filteredList.filter((p) => p.progressStatus === "completed").length;
  const inProgress = filteredList.filter((p) => p.progressStatus === "in_progress").length;
  const pending = filteredList.filter((p) => p.progressStatus === "pending").length;
  const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="page-title">📦 Tiến độ công việc</h1>
        <div className="header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm theo khách hàng, dịch vụ hoặc nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={fetchProgressList} className="refresh-btn">
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* 📊 Thống kê */}
      <div className="stats-wrapper">
        <div className="stat-card total">Tổng: {total}</div>
        <div className="stat-card completed">Hoàn thành: {completed}</div>
        <div className="stat-card inprogress">Đang làm: {inProgress}</div>
        <div className="stat-card pending">Chờ xử lý: {pending}</div>
      </div>

      {/* 📈 Thanh tiến độ */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${completionPercent}%` }}>
          {completionPercent}%
        </div>
      </div>

      {/* 📋 Danh sách công việc */}
      <div className="task-section">
        <h2>📋 Danh sách công việc</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th>Tổng tiền</th>
                <th>Nhân viên</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "1rem" }}>
                    🚫 Không có công việc nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredList.map((wp, index) => (
                  <tr key={wp.progressId} className={wp.highlight ? "highlight" : ""}>
                    <td>{index + 1}</td>
                    <td>{wp.customerName || "—"}</td>
                    <td>{wp.serviceName || "—"}</td>
                    <td>{wp.startDate || "—"}</td>
                    <td>{wp.endDate || "—"}</td>
                    <td>
                      {wp.totalAmount
                        ? wp.totalAmount.toLocaleString("vi-VN") + " ₫"
                        : "—"}
                    </td>
                    <td>{wp.employeeName || "—"}</td>
                    <td>
                      <input
                        defaultValue={wp.taskDescription}
                        onBlur={(e) =>
                          handleDescriptionChange(wp.progressId, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <span className={`status ${wp.progressStatus}`}>
                        {wp.progressStatus}
                      </span>
                    </td>
                    <td>
                      {wp.updatedAt
                        ? new Date(wp.updatedAt).toLocaleString("vi-VN")
                        : "—"}
                    </td>
                    <td>
                      <select
                        defaultValue={wp.progressStatus}
                        onChange={(e) =>
                          handleStatusChange(wp.progressId, e.target.value)
                        }
                      >
                        <option value="pending">⏸ Pending</option>
                        <option value="in_progress">⚙ In progress</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkProgressPage;
