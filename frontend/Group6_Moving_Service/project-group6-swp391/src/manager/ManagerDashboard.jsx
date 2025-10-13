import React from "react";
import { Link, Outlet } from "react-router-dom";
// import "./style/ManagerDashboard.css";

const ManagerDashboard = () => {
  return (
    <div className="manager-dashboard">
      <aside className="sidebar">
        <h2>Manager Dashboard</h2>
        <ul>
          <li><Link to="contract-assignment">Contracts</Link></li>
          <li><Link to="assignments">Assign Employee</Link></li>
          <li><Link to="payments">Payments</Link></li>
          <li><Link to="reports">Reports</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        {/* Outlet hiển thị nội dung trang con */}
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerDashboard;
