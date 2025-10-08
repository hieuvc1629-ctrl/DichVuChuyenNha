import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Typography, Card, Carousel, Space, Tag } from 'antd';
import { CheckCircleTwoTone, RocketTwoTone, ThunderboltTwoTone } from '@ant-design/icons';
import './style/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    navigate('/customer-register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={14}>
              <Typography.Title level={1} className="hero-title" style={{ color: '#fff', marginBottom: 16 }}>
                Dịch Vụ Chuyển Nhà <span className="highlight">Chuyên Nghiệp</span>
              </Typography.Title>
              <Typography.Paragraph className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.95)' }}>
                Chúng tôi cung cấp dịch vụ chuyển nhà an toàn, nhanh chóng và tiết kiệm chi phí.
                Đội ngũ giàu kinh nghiệm hỗ trợ bạn chuyển nhà dễ dàng nhất.
              </Typography.Paragraph>
              <Space size="middle" wrap>
                <Button size="large" type="primary" shape="round" onClick={handleGetQuote}>
                  Nhận Báo Giá Ngay
                </Button>
                <Button size="large" ghost shape="round" onClick={handleLogin}>
                  Đăng Nhập
                </Button>
              </Space>
              <div style={{ marginTop: 16 }}>
                <Space size={[8, 8]} wrap>
                  <Tag color="gold">Nhanh chóng</Tag>
                  <Tag color="geekblue">An toàn</Tag>
                  <Tag color="green">Tiết kiệm</Tag>
                </Space>
              </div>
            </Col>
            <Col xs={24} md={10}>
              <Carousel autoplay dots className="hero-carousel">
                <div>
                  <Card bordered={false} style={{ borderRadius: 16 }}>
                    <div style={{ fontSize: 64, textAlign: 'center' }}>🚚</div>
                    <Typography.Title level={4} style={{ textAlign: 'center', marginTop: 8 }}>Xe tải chuyên dụng</Typography.Title>
                  </Card>
                </div>
                <div>
                  <Card bordered={false} style={{ borderRadius: 16 }}>
                    <div style={{ fontSize: 64, textAlign: 'center' }}>📦</div>
                    <Typography.Title level={4} style={{ textAlign: 'center', marginTop: 8 }}>Đóng gói an toàn</Typography.Title>
                  </Card>
                </div>
                <div>
                  <Card bordered={false} style={{ borderRadius: 16 }}>
                    <div style={{ fontSize: 64, textAlign: 'center' }}>🛡️</div>
                    <Typography.Title level={4} style={{ textAlign: 'center', marginTop: 8 }}>Bảo hiểm đầy đủ</Typography.Title>
                  </Card>
                </div>
              </Carousel>
            </Col>
          </Row>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[24, 24]}>
            <Col xs={12} md={6} className="stats-item">
              <div className="stats-number">500+</div>
              <div className="stats-label">Khách hàng doanh nghiệp</div>
            </Col>
            <Col xs={12} md={6} className="stats-item">
              <div className="stats-number">150+</div>
              <div className="stats-label">Nhân sự chuyên nghiệp</div>
            </Col>
            <Col xs={12} md={6} className="stats-item">
              <div className="stats-number">75+</div>
              <div className="stats-label">Phương tiện vận chuyển</div>
            </Col>
            <Col xs={12} md={6} className="stats-item">
              <div className="stats-number">15+</div>
              <div className="stats-label">Năm kinh nghiệm</div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Dịch Vụ Của Chúng Tôi</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={6}>
              <Card hoverable bordered style={{ borderRadius: 16 }}>
                <div className="service-icon">📦</div>
                <Typography.Title level={4}>Đóng Gói Đồ Đạc</Typography.Title>
                <Typography.Paragraph>Đóng gói cẩn thận, an toàn cho mọi loại đồ đạc từ nhỏ đến lớn</Typography.Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card hoverable bordered style={{ borderRadius: 16 }}>
                <div className="service-icon">🚛</div>
                <Typography.Title level={4}>Vận Chuyển</Typography.Title>
                <Typography.Paragraph>Vận chuyển nhanh chóng, an toàn với xe tải chuyên dụng</Typography.Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card hoverable bordered style={{ borderRadius: 16 }}>
                <div className="service-icon">🔧</div>
                <Typography.Title level={4}>Lắp Đặt</Typography.Title>
                <Typography.Paragraph>Lắp đặt lại đồ đạc tại nhà mới theo yêu cầu của khách hàng</Typography.Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card hoverable bordered style={{ borderRadius: 16 }}>
                <div className="service-icon">🛡️</div>
                <Typography.Title level={4}>Bảo Hiểm</Typography.Title>
                <Typography.Paragraph>Bảo hiểm đầy đủ cho đồ đạc trong quá trình vận chuyển</Typography.Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={6}>
              <Card bordered hoverable style={{ borderRadius: 16, textAlign: 'center' }}>
                <RocketTwoTone twoToneColor="#667eea" style={{ fontSize: 40 }} />
                <Typography.Title level={4} style={{ marginTop: 12 }}>Kinh Nghiệm 10+ Năm</Typography.Title>
                <Typography.Paragraph>Hơn 10 năm kinh nghiệm trong ngành chuyển nhà</Typography.Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card bordered hoverable style={{ borderRadius: 16, textAlign: 'center' }}>
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 40 }} />
                <Typography.Title level={4} style={{ marginTop: 12 }}>Giá Cả Hợp Lý</Typography.Title>
                <Typography.Paragraph>Báo giá minh bạch, cạnh tranh thị trường</Typography.Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card bordered hoverable style={{ borderRadius: 16, textAlign: 'center' }}>
                <ThunderboltTwoTone twoToneColor="#faad14" style={{ fontSize: 40 }} />
                <Typography.Title level={4} style={{ marginTop: 12 }}>Hỗ Trợ 24/7</Typography.Title>
                <Typography.Paragraph>Đội ngũ hỗ trợ luôn sẵn sàng phục vụ</Typography.Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card bordered hoverable style={{ borderRadius: 16, textAlign: 'center' }}>
                <CheckCircleTwoTone twoToneColor="#764ba2" style={{ fontSize: 40 }} />
                <Typography.Title level={4} style={{ marginTop: 12 }}>Cam Kết Chất Lượng</Typography.Title>
                <Typography.Paragraph>100% hài lòng, hoàn tiền nếu không đạt</Typography.Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Typography.Title level={2} style={{ color: '#fff', textAlign: 'center' }}>Sẵn Sàng Chuyển Nhà?</Typography.Title>
            <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.95)', textAlign: 'center' }}>
              Liên hệ ngay để nhận báo giá miễn phí và tư vấn chi tiết
            </Typography.Paragraph>
            <div className="cta-buttons">
              <Button type="primary" size="large" shape="round" onClick={handleGetQuote}>
                Nhận Báo Giá Miễn Phí
              </Button>
              <Button size="large" shape="round" onClick={handleLogin}>
                Đăng Nhập Tài Khoản
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Dịch Vụ Chuyển Nhà</h3>
              <p>Chuyển nhà chuyên nghiệp, an toàn, tiết kiệm</p>
            </div>
            <div className="footer-section">
              <h3>Liên Hệ</h3>
              <p>📞 Hotline: 1900-xxxx</p>
              <p>📧 Email: info@dichvuchuyennha.com</p>
            </div>
            <div className="footer-section">
              <h3>Địa Chỉ</h3>
              <p>123 Đường ABC, Quận XYZ<br/>TP. Hồ Chí Minh</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Dịch Vụ Chuyển Nhà. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
