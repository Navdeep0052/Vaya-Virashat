import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ role }) {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to={role === 'admin' ? "/admin-dashboard" : "/owner-dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link to="/register-hotel">Register Hotel</Link>
        </li>
        {role === 'admin' ? (
          <li>
            <Link to="/hotels">All Hotels</Link>
          </li>
        ) : (
          <li>
            <Link to="/hotel-list">Hotel List</Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
