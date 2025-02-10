import React, { useState } from "react";
import "../styles/StudentLogin.css"; // ✅ Import the CSS file


function StudentLogin() {
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
    <div className="StudentLogin-container">
      <div className="StudentLogin-card">
      
        <h2 className="StudentLogin-heading">Student Login</h2>
        <form onSubmit={handleSubmit} className="StudentLogin-form">
          
          <label className="StudentLogin-label">Username:</label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="StudentLogin-input"
          />

          <label className="StudentLogin-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="StudentLogin-input"
          />
          <button type="submit" className="StudentLogin-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
