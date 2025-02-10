import React, { useState } from "react";
<<<<<<< HEAD
import "./registration.css"; 
=======
import "./registration.css"; // ✅ Import the CSS file
>>>>>>> 49d2a8b (Database integration, API fetch in frontend, APIs configuration in backend)

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
<<<<<<< HEAD
    alert(`Registration successful for ${formData.name}!`);
  };

=======

    fetch("http://localhost:8080/api/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dorm_preference: formData.dormPreference,
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
      console.log("Registration Success:", data);
      alert(`Registration successful for ${formData.name}!`);
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      alert("Registration failed, please try again.");
    });
  };


>>>>>>> 49d2a8b (Database integration, API fetch in frontend, APIs configuration in backend)
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
