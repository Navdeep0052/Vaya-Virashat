import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import './Signin.css';
import { toast } from 'react-toastify';

function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role : 'user'
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
        toast.success(data.msg || 'Signup successful!');
        setMessage(data.msg || 'Signup successful!');
        setIsSignup(false); // Switch to login form after successful signup
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
      const response = await fetch(apiurl + '/login/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Login successful!');
        setMessage(data.message || 'Login successful!');
        // Redirect or take appropriate action after successful login
      } else {
        toast.error(data.message || 'Login failed. Please try again.');
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="home-container">
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
