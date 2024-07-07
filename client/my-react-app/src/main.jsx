import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Signup from './Signin.jsx';
import Login from './Login.jsx';
import Home from './Signin.jsx';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage.jsx';
import Sidebar from './Sidebar';
import HotelDetails from './HotelDetails.jsx';
import Dashboard from './Dashboard.jsx';
import RegisterHotel from './Hotel.jsx';
import HotelList from './HotelList.jsx';
import AdminDashboard from './AdminDashboard.jsx'; // Import the AdminDashboard component
import './index.css';
import './App.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner-dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* New Route for AdminDashboard */}
          <Route path="/register-hotel" element={<RegisterHotel />} />
          <Route path="/hotel-list" element={<HotelList />} />
          <Route path="/edit-hotel/:hotelId" element={<RegisterHotel />} />
          <Route path="/hotel-detail/:hotelId" element={<RegisterHotel />} />
          <Route path="/HotelDetails/:hotelId" element={<HotelDetails />} />
          <Route path="/hotels" element={<HomePage />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  </React.StrictMode>
);
