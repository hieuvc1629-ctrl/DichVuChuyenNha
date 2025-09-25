import React from "react";
import { Button, message } from "antd";
import axios from "axios";

const Header = () => {
  const handleLogout = async () => {
    const token = localStorage.getItem("token"); // bạn lưu token sau khi login

    if (!token) {
      message.warning("Bạn chưa đăng nhập!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {}, // body rỗng
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Xoá token trong localStorage sau khi logout
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // nếu bạn có lưu user info

      message.success("Đăng xuất thành công!");
      // Điều hướng về trang login (nếu dùng react-router-dom)
      window.location.href = "/login";
    } catch (err) {
      message.error("Có lỗi khi đăng xuất!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", background: "#8B0000", color: "#fff" }}>
      <h2>🏠 Moving Service</h2>
      <Button type="primary" danger onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  );
};

export default Header;
