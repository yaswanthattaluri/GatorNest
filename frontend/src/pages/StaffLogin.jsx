import React, { useState } from "react";
import "../styles/StaffLogin.css";

function StaffLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login successful for ${formData.username}!`);
  };

  return (
    <div className="StaffLogin-container">
      <div className="StaffLogin-card">
        <h2 className="StaffLogin-heading">Staff Login</h2>
        <form onSubmit={handleSubmit} className="StaffLogin-form">
          
          <label className="StaffLogin-label">Username:</label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="StaffLogin-input"
          />

          <label className="StaffLogin-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="StaffLogin-input"
          />
          <button type="submit" className="StaffLogin-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
