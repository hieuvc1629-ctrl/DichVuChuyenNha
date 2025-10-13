import React from "react";
import { Link, Outlet } from "react-router-dom";
// import "./style/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <aside className="sidebar">
        <h2>Employee Dashboard</h2>
        <ul>
          <li><Link to="work-progress">Work Progress</Link></li>
          <li><Link to="contracts">My Contracts</Link></li>
          <li><Link to="feedbacks">Feedbacks</Link></li>
          <li><Link to="profile">Profile</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        {/* Outlet render ra component con */}
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeDashboard;
