import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Home from './Signin.jsx';
import Dashboard from './Dashboard.jsx'; // Import the Dashboard component
import RegisterHotel from './Hotel.jsx'; // Import the RegisterHotel component
import HotelList from './HotelList.jsx';
import './index.css';
import './App.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-hotel" element={<RegisterHotel />} /> {/* Add this line */}
        <Route path="/hotel-list" element={<HotelList />} /> {/* Add this line */}
        <Route path="/edit-hotel/:hotelId" element={<RegisterHotel />} />
        <Route path="/hotel-detail/:hotelId" element={<RegisterHotel />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
