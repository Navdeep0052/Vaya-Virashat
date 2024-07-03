import React from 'react';
import './Footer.css'; // Make sure to create and style this CSS file

const Footer = () => {
  return (
    <footer className="footer fixed-bottom">
      <div className="container text-center">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        <ul className="nav justify-content-center">
          <li className="nav-item"><a href="/about" className="nav-link">About Us</a></li>
          <li className="nav-item"><a href="/contact" className="nav-link">Contact</a></li>
          <li className="nav-item"><a href="/privacy" className="nav-link">Privacy Policy</a></li>
          <li className="nav-item"><a href="/terms" className="nav-link">Terms of Service</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
