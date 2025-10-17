import React, { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  FileTextOutlined,
  OrderedListOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Import your existing components
import QuotationApproval from "./QuotationApproval";
import UserRequestsPage from "./UserRequestsPage"; 
import UserContractsPage from "./UserContractPage";

const { Sider, Content } = Layout;
const { Title } = Typography;

const CustomerDashboard = () => {
  const navigate = useNavigate();
  // Khởi tạo state với mục đầu tiên là "Danh sách yêu cầu"
  const [selectedKey, setSelectedKey] = useState("my-requests"); 

  const renderContent = () => {
    switch (selectedKey) {
      case "my-requests":
        // Trang Danh sách yêu cầu
        // Lưu ý: UserRequestsPage cần được điều chỉnh để không tự tạo Sider/Layout.
        return <UserRequestsPage isEmbedded={true} />; 
      case "quotation-approval":
        // Trang Báo giá chờ duyệt
        return <QuotationApproval />;
      case "unsigned-contracts":
        // Trang Hợp đồng chờ ký
        return <UserContractsPage />;
      default:
        return (
          <Title level={4}>Chào mừng đến với Bảng điều khiển Khách hàng!</Title>
        );
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider cho thanh điều hướng */}
      <Sider width={260} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
        <div style={{ padding: 16 }}>
          <Title level={4} style={{ margin: 0, color: "#8B0000" }}>Giao dịch khách hàng</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ height: "100%", borderRight: 0 }}
          items={[
            { key: "my-requests", icon: <OrderedListOutlined />, label: "📝 Danh sách yêu cầu" },
            { key: "quotation-approval", icon: <FileTextOutlined />, label: "💰 Báo giá chờ duyệt" },
            { key: "unsigned-contracts", icon: <ScheduleOutlined />, label: "✍️ Hợp đồng chờ ký" },
            // Mục "Thông tin cá nhân" đã được loại bỏ
            { type: 'divider' }, 
            { key: "logout", label: "Đăng xuất", danger: true, onClick: () => { /* Logic đăng xuất */ } },
          ]}
        />
      </Sider>

      {/* Khu vực hiển thị nội dung */}
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
            borderRadius: "8px",
            marginTop: "24px"
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomerDashboard;