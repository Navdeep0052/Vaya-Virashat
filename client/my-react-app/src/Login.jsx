// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';


const apiurl = import.meta.env.VITE_BASE_API_URL;

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiurl +  '/login', {
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

      if (data.user && data.message) {
        toast.success(data.message); // Display success message
        localStorage.setItem('token', data.user.token);
        navigate('/dashboard'); // Redirect to dashboard after successful login
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error(error);
    }
  };

  return (
    <div className='signup-container'>
      <form className='signup-form' onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className='form-group'>
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