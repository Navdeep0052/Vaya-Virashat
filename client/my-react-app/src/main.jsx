// main.jsx
import React from 'react';
import ReactDOM from 'react-dom';
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
import Chats from './Chat';
import { SocketProvider } from './SocketContext';
import { ToastContainer } from 'react-toastify';
import Notification from './Notification';  

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
            <Route path="/executive-dashboard" element={<AdminDashboard />} />
            <Route path="/register-hotel" element={<RegisterHotel />} />
            <Route path="/hotel-list" element={<HotelList />} />
            <Route path="/edit-hotel/:hotelId" element={<RegisterHotel />} />
            <Route path="/hotel-detail/:hotelId" element={<RegisterHotel />} />
            <Route path="/HotelDetails/:hotelId" element={<HotelDetails />} />
            <Route path="/hotels" element={<HomePage />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/app" element={<App />} />
          </Routes>
        </main>
        <Footer />
        <Notification />  
      </Router>
      <ToastContainer />
    </SocketProvider>
  </React.StrictMode>
);
