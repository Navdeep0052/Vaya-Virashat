import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Make sure to create and style this CSS file

const Header = () => {
  const token = localStorage.getItem('token'); // Check if the user is logged in
  const role = localStorage.getItem('role'); // Get the role from local storage

  return (
    <header className="header fixed-top">
      <div className="">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/hotels">
            <img src="https://flb-public.s3.ap-south-1.amazonaws.com/sample.jpg" alt="Logo" className="logo" />
          </Link>
          <nav>
            <ul className="nav">
              {!token && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="nav-link">Sign Up</Link>
                  </li>
                </>
              )}
              {token && (
                <li className="nav-item">
                  <Link to={`/${role}-dashboard`} className="nav-link">Dashboard</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
