import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Make sure to create and style this CSS file

const Header = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const token = localStorage.getItem('token'); // Check if the user is logged in
  const role = localStorage.getItem('role'); // Get the role from local storage

  const handleLogoClick = () => {
    navigate('/hotels');
    setTimeout(() => {
      window.location.reload();
    }, 0); // Refresh the page after navigation
  };

  const handleDashboardClick = () => {
    navigate(`/${role}-dashboard`);
    setTimeout(() => {
      window.location.reload();
    }, 0); // Refresh the page after navigation
  };

  return (
    <header className="header fixed-top">
      <div className="">
        <div className="d-flex justify-content-between align-items-center">
          <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src="https://flb-public.s3.ap-south-1.amazonaws.com/sample.jpg" alt="Logo" className="logo" />
          </div>
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
                  <Link
                    to={`/${role}-dashboard`}
                    className="nav-link"
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </Link>
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
