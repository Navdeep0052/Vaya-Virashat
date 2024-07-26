import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const apiurl = import.meta.env.VITE_BASE_API_URL;

function Login({ setRole }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiurl + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.user && data.user.token) {
        toast.success('Login successful'); // Display success message

        // Store token and role
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userId', data.user._id);



        // Decode token to get user ID
        const token = data.user.token;
        const tokenParts = token.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload._id;

        // Store user ID in local storage
        localStorage.setItem('userId', userId);

        // Redirect based on role
        if (data.user.role === 'executive') {
          navigate('/executive-dashboard');
        } else {
          navigate('/owner-dashboard');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error(error);
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className='login-form-group'>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className='form-group'>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
