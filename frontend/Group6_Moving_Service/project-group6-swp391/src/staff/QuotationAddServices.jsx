import React, { useEffect, useState } from "react";
import { Table, Button, message, Tag } from "antd"; // Thêm Tag
import axiosInstance from "../service/axiosInstance";
import AddServiceModal from "./AddServiceModal";
import dayjs from "dayjs"; // Import dayjs

const QuotationAddServices = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [open, setOpen] = useState(false);

    const fetchQuotations = async () => {
        try {
            // API trả về data cần được xem xét lại cấu trúc, nhưng vẫn giữ logic ban đầu
            const res = await axiosInstance.get("/quotations/me");
            // API này trong file SurveyDashboard trả về res.data.result, tôi sẽ giả định sử dụng res.data.result
            setQuotations(Array.isArray(res.data.result) ? res.data.result : res.data || []);
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi tải danh sách báo giá!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    const columns = [
        { 
            title: "Mã báo giá", 
            dataIndex: "quotationId", 
            key: "id",
            // Thêm hiệu ứng hover nhẹ cho cột ID
            render: (text) => <span style={{ fontWeight: 600, color: '#1890ff' }}>#{text}</span>
        },
        { 
            title: "Tổng giá", 
            dataIndex: "totalPrice", 
            key: "totalPrice",
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            // Định dạng tiền tệ và làm nổi bật
            render: (price) => (
                <span style={{ fontWeight: 'bold', color: price > 0 ? '#52c41a' : '#999' }}>
                    {price ? price.toLocaleString() : 0} ₫
                </span>
            )
        },
        { 
            title: "Ngày tạo", 
            dataIndex: "createdDate", // Thay đổi key nếu API trả về createdDate hoặc createdAt
            key: "createdDate",
            render: (date) => (
                <Tag color="blue" style={{ borderRadius: 12 }}>
                    {dayjs(date).format("DD/MM/YYYY")}
                </Tag>
            )
        },
        { 
            title: "Trạng thái", 
            dataIndex: "status", 
            key: "status",
            render: (status) => {
                const color = status === 'PENDING' ? 'volcano' : status === 'APPROVED' ? 'green' : 'geekblue';
                return <Tag color={color} style={{ borderRadius: 4, fontWeight: 'bold' }}>{status}</Tag>
            }
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    // Thêm style hiện đại
                    style={{ borderRadius: 6, transition: 'all 0.3s' }}
                    onClick={() => {
                        setSelectedQuotation(record);
                        setOpen(true);
                    }}
                >
                    Thêm dịch vụ
                </Button>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={quotations}
                rowKey="quotationId"
                loading={loading}
                // Thêm style cho bảng để tăng độ bo tròn
                style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
                // Thêm hiệu ứng chuyển màu cho hàng khi hover
                rowClassName={() => 'quotation-row-hover'} 
                
            />
            {/* Cần thêm CSS sau để có hiệu ứng hover:
            <style jsx global>{`
                .quotation-row-hover:hover > td {
                    background-color: #e6f7ff !important;
                    transition: background-color 0.3s;
                }
            `}</style>
            */}
            <AddServiceModal
                open={open}
                quotation={selectedQuotation}
                onClose={() => setOpen(false)}
                onSuccess={fetchQuotations}
            />
        </>
    );
};

export default QuotationAddServices;