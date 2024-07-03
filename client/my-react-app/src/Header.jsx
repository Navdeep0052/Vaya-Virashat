import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Make sure to create and style this CSS file

const Header = () => {
  return (
    <header className="header fixed-top">
      <div className="">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/">
            <img src="https://flb-public.s3.ap-south-1.amazonaws.com/sample.jpg" alt="Logo" className="logo" />
          </Link>
          <nav>
            <ul className="nav">
              <li className="nav-item"><Link to="/hotels" className="nav-link">Hotels</Link></li>
              <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
              <li className="nav-item"><Link to="/signup" className="nav-link">Sign Up</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
