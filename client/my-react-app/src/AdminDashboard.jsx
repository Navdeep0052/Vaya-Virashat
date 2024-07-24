import React from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';

function AdminDashboard() {
  const role = localStorage.getItem('role'); // Get the role from local storage

  return (
    <div className="dashboard-container">
      <Sidebar role={role} />
      <div className="dashboard-content">
        <h2>Welcome to Executive Dashboard</h2>
        <p>This is your static dashboard content.</p>
        {/* Add more static content as needed */}
      </div>
    </div>
  );
}

export default AdminDashboard;
