import React, { useState } from "react";
import "./registration.css"; 

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dormPreference: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registration successful for ${formData.name}!`);
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="registration-heading">🏡 Hostel Registration</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          
          <label className="registration-label">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="registration-input"
          />

          <label className="registration-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="registration-input"
          />

          <label className="registration-label">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="registration-input"
          />

          <label className="registration-label">Dorm Preference:</label>
          <input
            type="text"
            name="dormPreference"
            value={formData.dormPreference}
            onChange={handleChange}
            required
            className="registration-input"
          />

          <label className="registration-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="registration-input"
          />

          <button type="submit" className="registration-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
