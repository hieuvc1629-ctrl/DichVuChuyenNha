import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #000 60%, #333 100%)",
          color: "#fff",
          padding: "100px 0",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "bold",
                  lineHeight: "1.2",
                }}
              >
                Chào mừng đến với <br /> Moving Service
              </h1>
              <p style={{ fontSize: "1.25rem", marginTop: "20px" }}>
                Giải pháp chuyển nhà toàn diện – An toàn, Nhanh chóng, Tiện lợi
              </p>
              <Button
                variant="light"
                size="lg"
                href="/customer-register"
                style={{ marginTop: "30px", fontWeight: "600" }}
              >
                Đăng kí ngay
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img
                src="https://i.pinimg.com/1200x/ae/38/9e/ae389eb16d8f0ed1d52775033a34a4c6.jpg"
                alt="Hero Moving Service"
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Us Section */}
      <section
        style={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "80px 0",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img
                src="https://i.pinimg.com/1200x/4e/b2/16/4eb2160fa9cc7423dc2ffd61c1645a23.jpg"
                alt="About us"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </Col>
            <Col md={6}>
              <h2 style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
                Về Chúng Tôi
              </h2>
              <p style={{ fontSize: "1.1rem", marginTop: "20px" }}>
                Moving Service là đơn vị cung cấp dịch vụ chuyển nhà uy tín với
                nhiều năm kinh nghiệm. Chúng tôi cam kết mang đến trải nghiệm
                chuyển nhà an toàn, nhanh chóng và tiết kiệm cho khách hàng.
              </p>
              <p>
                Với đội ngũ nhân viên chuyên nghiệp, phương tiện vận chuyển hiện
                đại và quy trình làm việc khoa học, chúng tôi luôn sẵn sàng đáp
                ứng mọi nhu cầu chuyển nhà, văn phòng, kho xưởng của bạn.
              </p>
              <Button variant="dark" size="lg" href="/customer-register">
                Liên hệ ngay
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section
        style={{
          backgroundColor: "#f8f9fa",
          color: "#000",
          padding: "80px 0",
        }}
      >
        <Container>
          <h2
            className="text-center mb-5"
            style={{ fontWeight: "bold", fontSize: "2.5rem" }}
          >
            Dịch Vụ Của Chúng Tôi
          </h2>
          <Row>
            {[
              {
                title: "Chuyển Nhà Trọn Gói",
                text: "Giúp bạn tiết kiệm thời gian và công sức với dịch vụ trọn gói từ A → Z.",
                img: "https://i.pinimg.com/1200x/e1/96/05/e196055c4a1a6fe04ec438d57e747d30.jpg",
              },
              {
                title: "Chuyển Văn Phòng",
                text: "Di dời văn phòng chuyên nghiệp, đảm bảo tiến độ và an toàn tài sản.",
                img: "https://i.pinimg.com/1200x/6b/8d/f0/6b8df0de92c4333d34a2463d2014fd7b.jpg",
              },
              {
                title: "Vận Chuyển Kho Xưởng",
                text: "Giải pháp vận chuyển hàng hóa, thiết bị kho xưởng quy mô lớn hiệu quả.",
                img: "https://i.pinimg.com/1200x/34/70/27/347027715d106014a35b6072340bb218.jpg",
              },
            ].map((service, idx) => (
              <Col md={4} key={idx}>
                <Card className="mb-4 shadow-sm h-100 service-card">
                  <Card.Img
                    variant="top"
                    src={service.img}
                    alt={service.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{service.title}</Card.Title>
                    <Card.Text>{service.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#000",
          color: "#fff",
          padding: "30px 0",
          textAlign: "center",
        }}
      >
        <Container>
          <p>
            © {new Date().getFullYear()} Moving Service. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
