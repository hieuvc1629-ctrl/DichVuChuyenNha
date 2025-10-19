import React, { useEffect, useState } from "react";
import { Layout, Card, Form, message, Menu, Row, Col, Statistic, Badge } from "antd"; 
import {
    DollarOutlined,
    FileAddOutlined,
    AppstoreOutlined,
    ContainerOutlined,
    // Import thêm các icon khác nếu cần thiết để tăng tính thẩm mỹ
} from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "../service/axiosInstance";

// Import components
import { RequestList } from "./RequestList";
import { SurveyList } from "./SurveyList";
import { QuotationList } from "./QuotationList";
import { CreateSurveyModal } from "./CreateSurveyModal";
import { EditSurveyModal } from "./EditSurveyModal";
import { CreateQuotationModal } from "./CreateQuotationModal";
import QuotationAddServices from "./QuotationAddServices";

const { Content, Sider } = Layout;

// Dữ liệu màu sắc hiện đại cho các Statistic Card
const STAT_COLORS = {
    requests: { color: '#1890ff', bg: '#e6f7ff' }, // Blue
    surveys: { color: '#52c41a', bg: '#f6ffed' },  // Green
    quotations: { color: '#faad14', bg: '#fffbe6' }, // Yellow/Orange
};

const SurveyDashboard = () => {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [quoteForm] = Form.useForm();

    const [requests, setRequests] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [selectedQuotation, setSelectedQuotation] = useState(null);

    const [activeMenu, setActiveMenu] = useState("survey");

    // Modal states (Giữ nguyên)
    const [createSurveyModalVisible, setCreateSurveyModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [createQuotationModalVisible, setCreateQuotationModalVisible] = useState(false);

    const [selectedRequestForSurvey, setSelectedRequestForSurvey] = useState(null);
    const [editingSurvey, setEditingSurvey] = useState(null);
    const [selectedSurveyForQuotation, setSelectedSurveyForQuotation] = useState(null);

    // ====== FETCH API (Giữ nguyên) ======
    useEffect(() => {
        fetchRequests();
        fetchSurveys();
        fetchQuotations();
    }, []);

    useEffect(() => {
        if (selectedQuotation) {
            const updated = quotations.find(
                (q) => q.quotationId === selectedQuotation.quotationId
            );
            if (updated) {
                setSelectedQuotation(updated);
            }
        }
    }, [quotations]);

    useEffect(() => {
        if (activeMenu === "quotation") {
            fetchQuotations();
        }
    }, [activeMenu]);

    const fetchRequests = async () => {
        try {
            const res = await axiosInstance.get("/requests/my-requests");
            setRequests(Array.isArray(res.data.result) ? res.data.result : res.data || []);
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi tải yêu cầu!");
        }
    };

    const fetchSurveys = async () => {
        try {
            const res = await axiosInstance.get("/surveys/my");
            const data =
                Array.isArray(res.data) ? res.data :
                    Array.isArray(res.data.result) ? res.data.result : [];
            setSurveys(data);
        } catch (err) {
            console.error("❌ Lỗi khi tải khảo sát:", err);
            message.error("Lỗi khi tải khảo sát!");
        }
    };

    const fetchQuotations = async () => {
        try {
            const res = await axiosInstance.get("/quotations/me");
            setQuotations(Array.isArray(res.data.result) ? res.data.result : res.data || []);
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi tải báo giá!");
        }
    };

    // ====== SURVEY & QUOTATION Handlers (Giữ nguyên) ======
    const handleOpenCreateSurvey = (request) => {
        setSelectedRequestForSurvey(request);
        form.setFieldsValue({ surveyDate: dayjs() });
        setCreateSurveyModalVisible(true);
    };

    const handleSubmitSurvey = async (values) => {
        try {
            const payload = {
                ...values,
                requestId: selectedRequestForSurvey.requestId,
                surveyDate: values.surveyDate.toISOString(),
               
            };
            await axiosInstance.post("/surveys", payload);
            message.success("Tạo khảo sát thành công!");
            form.resetFields();
            setSelectedRequestForSurvey(null);
            setCreateSurveyModalVisible(false);
            fetchSurveys();

        } catch {
            message.error("Tạo khảo sát thất bại!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/surveys/${id}`);
            message.success("Xóa khảo sát thành công!");
            fetchSurveys();
        } catch {
            message.error("Không thể xóa khảo sát!");
        }
    };

    const handleEdit = (record) => {
        setEditingSurvey(record);
        editForm.setFieldsValue({
            ...record,
            surveyDate: dayjs(record.surveyDate),
        });
        setEditModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            const values = await editForm.validateFields();
            await axiosInstance.put(`/surveys/${editingSurvey.surveyId}`, {
                ...values,
                surveyDate: values.surveyDate.toISOString(),
            });
            message.success("Cập nhật khảo sát thành công!");
            setEditModalVisible(false);
            fetchSurveys();
        } catch {
            message.error("Lỗi khi cập nhật khảo sát!");
        }
    };

    const handleOpenCreateQuotation = (survey) => {
        setSelectedSurveyForQuotation(survey);
        quoteForm.setFieldsValue({ createdDate: dayjs() });
        setCreateQuotationModalVisible(true);
    };

    const handleCreateQuotation = async (values) => {
        try {
            const payload = {
                ...values,
                surveyId: selectedSurveyForQuotation.surveyId,
                createdDate: dayjs(values.createdDate).format("YYYY-MM-DDTHH:mm:ss"),
            };
            await axiosInstance.post("/quotations", payload);
            message.success("Tạo báo giá thành công!");
                    
       

            quoteForm.resetFields();
            setSelectedSurveyForQuotation(null);
            setCreateQuotationModalVisible(false);
            fetchQuotations();
        } catch {
            message.error("Tạo báo giá thất bại!");
        }
    };

    // Hàm render card thống kê hiện đại
    const renderStatCard = (title, value, IconComponent, colors) => (
        <Card 
            bordered={false} 
            // Thêm hiệu ứng đổ bóng và bo tròn lớn hơn
            style={{ 
                borderRadius: 12, 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s',
            }}
            // Thêm hiệu ứng hover
            className="modern-stat-card"
            hoverable
        >
            <Row align="middle" gutter={16}>
                <Col>
                    {/* Icon lớn hơn, bo tròn và có màu nền nhẹ */}
                    <div style={{
                        backgroundColor: colors.bg,
                        padding: 12,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <IconComponent style={{ fontSize: '28px', color: colors.color }} />
                    </div>
                </Col>
                <Col flex="auto">
                    <Statistic
                        title={<span style={{ fontWeight: 500, color: '#666' }}>{title}</span>}
                        value={value}
                        valueStyle={{ 
                            color: colors.color, 
                            fontWeight: 'bold', 
                            fontSize: '24px' 
                        }}
                    />
                </Col>
            </Row>
        </Card>
    );
    
    // ====== RENDER DASHBOARD ======
    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* ========== SIDEBAR (Giữ nguyên) ========== */}
            <Sider width={220} theme="light">
                <div
                    style={{
                        padding: "20px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: '1px solid #f0f0f0',
                    }}
                >
                    <span>Dashboard</span>

                    {/* BADGE QUẢN LÝ BÁO GIÁ */}
                    <Badge
                        count={quotations.length}
                        overflowCount={99}
                        style={{
                            backgroundColor: '#faad14',
                            cursor: 'pointer',
                            boxShadow: activeMenu === 'quotation' ? '0 0 5px #faad14' : 'none',
                            marginLeft: 8, 
                        }}
                        onClick={() => setActiveMenu("quotation")} 
                        title="Quản lý Báo Giá"
                    >
                        <DollarOutlined 
                            style={{ 
                                fontSize: '24px', 
                                padding: 6,
                                color: activeMenu === 'quotation' ? '#1890ff' : '#666',
                                backgroundColor: activeMenu === 'quotation' ? '#e6f7ff' : 'transparent',
                                borderRadius: 6,
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                            }} 
                            onClick={() => setActiveMenu("quotation")}
                        />
                    </Badge>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[activeMenu]} 
                    onClick={(e) => setActiveMenu(e.key)}
                    style={{ height: "100%", borderRight: 0 }}
                    items={[
                        {
                            key: "survey",
                            icon: <FileAddOutlined />,
                            label: "Quản lý Khảo Sát",
                        },
                        {
                            key: "addService",
                            icon: <AppstoreOutlined />,
                            label: "Dịch vụ Báo Giá",
                        },
                    ]}
                />
            </Sider>

            {/* ========== MAIN CONTENT ========== */}
            <Layout style={{ padding: "20px" }}>
                <Content>
                    
                    {/* ========== STATS CARDS MỚI ========== */}
                    <Row gutter={24} style={{ marginBottom: 30 }}> {/* Tăng gutter và margin */}
                        <Col span={8}>
                            {renderStatCard("Tổng Yêu Cầu", requests.length, ContainerOutlined, STAT_COLORS.requests)}
                        </Col>
                        <Col span={8}>
                            {renderStatCard("Tổng Khảo Sát", surveys.length, FileAddOutlined, STAT_COLORS.surveys)}
                        </Col>
                        <Col span={8}>
                            {renderStatCard("Tổng Báo Giá", quotations.length, DollarOutlined, STAT_COLORS.quotations)}
                        </Col>
                    </Row>
                    {/* ---------------------------------- */}


                    <h2 style={{ marginBottom: 20 }}>
                        {activeMenu === "survey"
                            ? "Quản lý Khảo Sát"
                            : activeMenu === "quotation"
                                ? "Quản lý Báo Giá"
                                : "Dịch vụ Báo Giá"}
                    </h2>

                    {/* ==== KHẢO SÁT ==== */}
                    {activeMenu === "survey" && (
                        <>
                            <Card title="Danh sách yêu cầu" style={{ marginBottom: 20 }}>
                                <RequestList
                                    requests={requests}
                                    onCreateSurvey={handleOpenCreateSurvey}
                                />
                            </Card>

                            <Card title="Danh sách khảo sát">
                                <SurveyList
                                    surveys={surveys}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onCreateQuotation={handleOpenCreateQuotation}
                                />
                            </Card>
                        </>
                    )}

                    {/* ==== BÁO GIÁ ==== */}
                    {activeMenu === "quotation" && (
                        <Card title="Danh sách báo giá">
                            <QuotationList
                                quotations={quotations}
                                fetchQuotations={fetchQuotations}
                                selectedQuotation={selectedQuotation}
                                setSelectedQuotation={setSelectedQuotation}
                            />
                        </Card>
                    )}

                    {/* ==== DỊCH VỤ BÁO GIÁ ==== */}
                    {activeMenu === "addService" && (
                        <Card title="Thêm dịch vụ vào báo giá">
                            <QuotationAddServices />
                        </Card>
                    )}
                </Content>
            </Layout>

            {/* ==== MODALS (Giữ nguyên) ==== */}
            <CreateSurveyModal
                visible={createSurveyModalVisible}
                form={form}
                selectedRequest={selectedRequestForSurvey}
                onCancel={() => {
                    setCreateSurveyModalVisible(false);
                    setSelectedRequestForSurvey(null);
                    form.resetFields();
                }}
                onSubmit={handleSubmitSurvey}
            />

            <EditSurveyModal
                visible={editModalVisible}
                form={editForm}
                onCancel={() => setEditModalVisible(false)}
                onUpdate={handleUpdate}
            />

            <CreateQuotationModal
                visible={createQuotationModalVisible}
                form={quoteForm}
                selectedSurvey={selectedSurveyForQuotation}
                onCancel={() => {
                    setCreateQuotationModalVisible(false);
                    setSelectedSurveyForQuotation(null);
                    quoteForm.resetFields();
                }}
                onSubmit={handleCreateQuotation}
            />
        </Layout>
    );
};

export default SurveyDashboard;