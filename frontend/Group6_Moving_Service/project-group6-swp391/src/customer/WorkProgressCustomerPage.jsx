import { useEffect, useState } from "react";
import workProgressApi from "../service/workprogress";
import "./style/WorkProgressCustomerPage.css";

function WorkProgressCustomerPage() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📡 Lấy danh sách tiến độ của khách hàng
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await workProgressApi.getCustomerList();
        setProgressList(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải tiến độ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">⏳ Đang tải tiến độ công việc...</div>;
  }

  return (
    <div className="customer-progress-container">
      <h1 className="page-title">📦 Tiến Độ Quá Trình Chuyển Đồ</h1>

      {progressList.length === 0 ? (
        <p className="empty-text">Hiện tại chưa có tiến độ công việc nào.</p>
      ) : (
        <div className="progress-grid">
          {progressList.map((item) => (
            <div key={item.progressId} className="progress-card">
              <div className="card-header">
                {/* <h2>Hợp đồng #{item.contractId}</h2> */}
                <span className={`status ${item.progressStatus}`}>
                  {item.progressStatus}
                </span>
              </div>

              <div className="card-body">
                <p><strong>Mô tả:</strong> {item.taskDescription}</p>
                <p><strong>Ngày cập nhật:</strong> {new Date(item.updatedAt).toLocaleString()}</p>
                <p><strong>Dịch vụ:</strong> {item.serviceName}</p>
                <p><strong>Khách hàng:</strong> {item.customerName}</p>
                <p><strong>Tổng tiền:</strong> {item.totalAmount?.toLocaleString("vi-VN")} ₫</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkProgressCustomerPage;
