import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Signup from './Signin.jsx';
import Login from './Login.jsx';
import Home from './Signin.jsx';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HotelCards.jsx';
import Sidebar from './Sidebar';
import HotelDetails from './HotelDetails.jsx';
import Dashboard from './Dashboard.jsx';
import RegisterHotel from './Hotel.jsx';
import HotelList from './HotelList.jsx';
import AdminDashboard from './AdminDashboard.jsx'; 
import Profile from './profile.jsx';
import './index.css';
import './App.css'; 
import Chats from './Chat'; // Import Chats component
import { SocketProvider } from './SocketContext'; // Import SocketProvider

const apiurl = import.meta.env.VITE_BASE_API_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>
      <Router>
        <Header />
        <main className="main-content">
          <Profile apiurl={apiurl} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/owner-dashboard" element={<Dashboard />} />
            <Route path="/executive-dashboard" element={<AdminDashboard />} /> {/* New Route for AdminDashboard */}
            <Route path="/register-hotel" element={<RegisterHotel />} />
            <Route path="/hotel-list" element={<HotelList />} />
            <Route path="/edit-hotel/:hotelId" element={<RegisterHotel />} />
            <Route path="/hotel-detail/:hotelId" element={<RegisterHotel />} />
            <Route path="/HotelDetails/:hotelId" element={<HotelDetails />} />
            <Route path="/hotels" element={<HomePage />} />
            <Route path="/chats" element={<Chats />} /> {/* Pass socket instance to Chats component */}
            <Route path="/app" element={<App />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </SocketProvider>
  </React.StrictMode>
);
