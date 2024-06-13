import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import './Signin.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isSignup, setIsSignup] = useState(true);
  const [message, setMessage] = useState('');
  const apiurl = import.meta.env.VITE_BASE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiurl + '/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Signup successful!');
        //setMessage(data.message || 'Signup successful!');
        setIsSignup(false);
      } else {
        toast.error(data.error || 'Signup failed. Please try again.');
        setMessage(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiurl + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      console.log('Response data:', data);  // Debugging log
  
      if (response.ok) {
        toast.success(data.message || 'Login successful!');
        setMessage(data.message || 'Login successful!');
        // Save the token if needed
        localStorage.setItem('token', data.user.token);
      } else {
        toast.error(data.message || 'Login failed. Please try again.');
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);  // Debugging log
      toast.error('An error occurred. Please try again.');
      setMessage('An error occurred. Please try again.');
    }
  };   

  return (
    <div className="home-container">
      <ToastContainer />
      <h1 className="title">Welcome to Vaya Virashat</h1>
      {message && <p className="message">{message}</p>}
      {isSignup ? (
        <Signup
          formData={formData}
          handleChange={handleChange}
          handleSignup={handleSignup}
        />
      ) : (
        <Login
          formData={formData}
          handleChange={handleChange}
          handleLogin={handleLogin}
        />
      )}
      <button className="switch" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
      </button>
    </div>
  );
}

export default Home;
