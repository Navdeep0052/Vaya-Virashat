import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ onAllHotelsClick }) { // Accept the handler function as a prop
  const role = localStorage.getItem('role'); // Get role from local storage

  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to={role === 'executive' ? "/executive-dashboard" : "/owner-dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link to="/register-hotel">Register Hotel</Link>
        </li>
        {role === 'executive' ? (
          <li>
            <Link to="/hotels" onClick={onAllHotelsClick}>All Hotels</Link> {/* Call the handler */}
          </li>
        ) : (
          <li>
            <Link to="/hotel-list">Hotel List</Link>
          </li>
        )}
        <li>
          <Link to="/chats">Chats</Link> {/* New link for Chats */}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
