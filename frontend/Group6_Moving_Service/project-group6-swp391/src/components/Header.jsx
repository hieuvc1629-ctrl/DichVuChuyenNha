import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Dropdown, Menu } from "antd";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menu = (
    <Menu
      items={[
        {
          key: "profile",
          label: "Hồ sơ",
          onClick: () => navigate("/profile"),
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: "Đăng xuất",
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ borderBottom: "2px solid #333" }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: "bold", color: "#fff" }}>
          🏠 Moving Service
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {!token ? (
              <>
                <Nav.Link as={Link} to="/login" style={{ color: "#fff" }}>
                  Đăng nhập
                </Nav.Link>
                <Button as={Link} to="/customer-register" variant="light" className="ms-2">
                  Đăng ký
                </Button>
              </>
            ) : (
              <Dropdown overlay={menu} placement="bottomRight" arrow>
                <Button type="text" style={{ color: "#fff" }}>
                  {user?.username || "Tài khoản"}
                </Button>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
