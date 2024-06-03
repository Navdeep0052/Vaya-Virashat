import React from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css'; // Create a CSS file for Dashboard styling if needed

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h2>Welcome to Owner Dashboard</h2>
        <p>This is your static dashboard content.</p>
        {/* Add more static content as needed */}
      </div>
    </div>
  );
}

export default Dashboard;
