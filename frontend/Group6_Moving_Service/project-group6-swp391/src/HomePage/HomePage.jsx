import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div className="hero-content">
          <h1 className="hero-title">
            Dịch Vụ Chuyển Nhà <span className="highlight">Chuyên Nghiệp</span>
          </h1>
          <p className="hero-subtitle">
            Chúng tôi cung cấp dịch vụ chuyển nhà an toàn, nhanh chóng và tiết kiệm chi phí. 
            Đội ngũ nhân viên giàu kinh nghiệm sẽ giúp bạn chuyển nhà một cách dễ dàng nhất.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleGetQuote}>
              Nhận Báo Giá Ngay
            </button>
            <button className="btn-secondary" onClick={handleLogin}>
              Đăng Nhập
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="moving-truck">🚚</div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Dịch Vụ Của Chúng Tôi</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">📦</div>
              <h3>Đóng Gói Đồ Đạc</h3>
              <p>Đóng gói cẩn thận, an toàn cho mọi loại đồ đạc từ nhỏ đến lớn</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚛</div>
              <h3>Vận Chuyển</h3>
              <p>Vận chuyển nhanh chóng, an toàn với xe tải chuyên dụng</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Lắp Đặt</h3>
              <p>Lắp đặt lại đồ đạc tại nhà mới theo yêu cầu của khách hàng</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🛡️</div>
              <h3>Bảo Hiểm</h3>
              <p>Bảo hiểm đầy đủ cho đồ đạc trong quá trình vận chuyển</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <h3>Kinh Nghiệm 10+ Năm</h3>
              <p>Với hơn 10 năm kinh nghiệm trong ngành chuyển nhà</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">02</div>
              <h3>Giá Cả Hợp Lý</h3>
              <p>Báo giá minh bạch, cạnh tranh nhất thị trường</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">03</div>
              <h3>Hỗ Trợ 24/7</h3>
              <p>Đội ngũ hỗ trợ khách hàng 24/7, luôn sẵn sàng phục vụ</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">04</div>
              <h3>Cam Kết Chất Lượng</h3>
              <p>100% hài lòng với dịch vụ, hoàn tiền nếu không đạt yêu cầu</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn Sàng Chuyển Nhà?</h2>
            <p>Liên hệ ngay với chúng tôi để nhận báo giá miễn phí và tư vấn chi tiết</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={handleGetQuote}>
                Nhận Báo Giá Miễn Phí
              </button>
              <button className="btn-outline" onClick={handleLogin}>
                Đăng Nhập Tài Khoản
              </button>
            </div>
          </div>
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
