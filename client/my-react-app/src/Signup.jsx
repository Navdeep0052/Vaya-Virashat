import React from "react";
import { toast } from "react-toastify";
import "./Signup.css";

function Signup({ formData, handleChange, handleSignup }) {
  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Signup</h2>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <div className="form-group">
          <label className="role-label">
            <b>Signup as:</b>
          </label>
          <div className="role-group">
            <label>User</label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={formData.role === "user"}
              onChange={handleChange}
              required
              style={{ width: "2rem" }}
            />

            <label>Owner</label>
            <input
              type="radio"
              name="role"
              value="owner"
              checked={formData.role === "owner"}
              onChange={handleChange}
              required
              style={{ width: "2rem" }}
            />
          </div>
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
