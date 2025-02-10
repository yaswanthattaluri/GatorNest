import React, { useState } from "react";
import "../styles/StudentLogin.css";

function StudentLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/student/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(`HTTP error! status: ${res.status} - ${text}`);
        });
      }
      return res.json();
    })
    .then((data) => {
      console.log("Login Success:", data);
      alert(`Login successful for ${formData.email}!`);
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert("Login failed, please check your credentials and try again.");
    });
  };

  return (
    <div className="StudentLogin-container">
      <div className="StudentLogin-card">
        <h2 className="StudentLogin-heading">Student Login</h2>
        <form onSubmit={handleSubmit} className="StudentLogin-form">
          <label className="StudentLogin-label">Username:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="StudentLogin-input" />

          <label className="StudentLogin-label">Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="StudentLogin-input" />

          <button type="submit" className="StudentLogin-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
