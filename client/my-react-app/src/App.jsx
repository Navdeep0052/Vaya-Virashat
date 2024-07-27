import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Signin';
import RegisterHotel from './Hotel';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import Login from './Login'; 
import { SocketProvider } from './SocketContext';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  // Function to update role in App component state and local storage
  const setRoleAndUpdateStorage = (newRole) => {
    localStorage.setItem('role', newRole);
    setRole(newRole);
  };

  return (
    <SocketProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home setRole={setRoleAndUpdateStorage} />} />
          <Route path="/owner-dashboard" element={<Dashboard />} />
          <Route path="/executive-dashboard" element={<AdminDashboard />} />
          <Route path="/register-hotel" element={<RegisterHotel />} />
          <Route path="/login" element={<Login setRole={setRoleAndUpdateStorage} />} /> {/* Route for Login */}
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;