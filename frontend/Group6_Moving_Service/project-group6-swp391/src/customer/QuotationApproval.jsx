import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Form, ListGroup, Modal } from "react-bootstrap";
import axios from "axios";

const QuotationApproval = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [agree, setAgree] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8080/api/quotations/pending/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuotations(res.data);
      } catch (err) {
        alert("Không thể tải danh sách báo giá!");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  const handleApprove = async (quotationId) => {
    if (!agree) {
      alert("Vui lòng đồng ý với báo giá trước khi xác nhận!");
      return;
    }

    setApproving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/quotations/approve/${quotationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Bạn đã chấp thuận báo giá này!");
      setQuotations((prev) => prev.filter((q) => q.id !== quotationId));
      setSelectedQuotation(null);
      setAgree(false);
    } catch (err) {
      alert("Cập nhật thất bại, vui lòng thử lại!");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (quotationId) => {
    setRejecting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/quotations/reject/${quotationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Bạn đã từ chối báo giá này!");
      setQuotations((prev) => prev.filter((q) => q.id !== quotationId));
      setSelectedQuotation(null);
      setShowRejectConfirm(false);
    } catch (err) {
      alert("Không thể từ chối báo giá, vui lòng thử lại!");
    } finally {
      setRejecting(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Đang tải báo giá...</span>
      </div>
    );

  return (
    <div className="container py-5">
      <h1 className="text-center text-danger mb-5">
        Danh sách báo giá chờ bạn chấp thuận
      </h1>

      {quotations.length === 0 ? (
        <p className="text-center text-muted">Không có báo giá nào đang chờ.</p>
      ) : (
        <div className="row g-4">
          {quotations.map((quotation, idx) => (
            <div className="col-md-6 col-lg-4" key={idx}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{quotation.companyName || "Công ty chuyển nhà"}</Card.Title>
                  <Card.Text>
                    <strong>Khách hàng:</strong> {quotation.username || "Ẩn danh"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Ngày khảo sát:</strong>{" "}
                    {quotation.surveyDate
                      ? new Date(quotation.surveyDate).toLocaleDateString()
                      : "Không rõ"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Tổng giá:</strong>{" "}
                    {quotation.totalPrice
                      ? quotation.totalPrice.toLocaleString("vi-VN") + " ₫"
                      : "Chưa có"}
                  </Card.Text>
                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={() => {
                      setSelectedQuotation(quotation);
                      setAgree(false);
                      setShowRejectConfirm(false);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết */}
      <Modal
        show={!!selectedQuotation}
        onHide={() => setSelectedQuotation(null)}
        size="lg"
        centered
      >
        {selectedQuotation && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Chi tiết báo giá</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p><strong>Khách hàng:</strong> {selectedQuotation.username}</p>
                  <p><strong>Công ty:</strong> {selectedQuotation.companyName}</p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Ngày khảo sát:</strong>{" "}
                    {selectedQuotation.surveyDate
                      ? new Date(selectedQuotation.surveyDate).toLocaleDateString()
                      : "Không rõ"}
                  </p>
                  <p>
                    <strong>Địa chỉ chuyển:</strong> {selectedQuotation.addressFrom} → {selectedQuotation.addressTo}
                  </p>
                  <p><strong>Dịch vụ kèm theo:</strong> {selectedQuotation.listService || "Không rõ"}</p>
                </div>
              </div>

              <h5>Chi tiết dịch vụ:</h5>
              <ListGroup className="mb-3">
                {selectedQuotation.services.map((item, index) => (
                  <ListGroup.Item key={index}>
                    {item.serviceName} ({item.priceType}) — SL: {item.quantity} —{" "}
                    <strong>{item.subtotal?.toLocaleString("vi-VN")} ₫</strong>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Form.Check
                type="checkbox"
                label="Tôi chấp thuận báo giá này từ công ty"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />

              <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
                <Button
                  variant="danger"
                  className="flex-fill"
                  disabled={!agree || approving}
                  onClick={() => handleApprove(selectedQuotation.quotationId)}
                >
                  {approving ? "Đang xử lý..." : "Xác nhận chấp thuận báo giá"}
                </Button>

                {!showRejectConfirm ? (
                  <Button
                    variant="outline-danger"
                    className="flex-fill"
                    onClick={() => setShowRejectConfirm(true)}
                  >
                    Từ chối báo giá
                  </Button>
                ) : (
                  <div className="d-flex flex-column flex-sm-row gap-2 flex-fill align-items-center">
                    <span>Bạn có chắc chắn muốn từ chối?</span>
                    <Button
                      variant="outline-danger"
                      className="flex-fill"
                      disabled={rejecting}
                      onClick={() => handleReject(selectedQuotation.quotationId)}
                    >
                      {rejecting ? "Đang xử lý..." : "Từ chối"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-fill"
                      disabled={rejecting}
                      onClick={() => setShowRejectConfirm(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
};

export default QuotationApproval;
