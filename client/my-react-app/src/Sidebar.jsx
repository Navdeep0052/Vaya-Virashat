import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/register-hotel">Register Hotel</Link> {/* Updated path */}
        </li>
        <li>
          <Link to="/hotel-list">Hotel List</Link> {/* Add this line */}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
