import React, { useState } from "react";
import "../styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    major: "",
    language: "",
    contact: "", // Added contact field
    earlyBird: "",
    cleanliness: "",
    diet: "",
    visitors: "",
    sameLanguage: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Retrieve JWT token

    if (!token) {
      alert("Unauthorized! Please log in again.");
      navigate("/login"); // Redirect to login page if no token
      return;
    }

    fetch("http://localhost:8080/api/student/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach token in headers
      },
      body: JSON.stringify({
        gender: formData.gender,
        age: parseInt(formData.age), // Ensure age is an integer
        major: formData.major,
        language_spoken: formData.language,
        contact: formData.contact, // Include contact in request payload
        preference: formData.earlyBird,
        cleanliness_habits: formData.cleanliness,
        food_preference: formData.diet,
        having_people_over: formData.visitors,
        same_language_roommate: formData.sameLanguage,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(`Error: ${res.status} - ${text}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Profile Updated:", data);
        alert("Profile preferences saved successfully!");
        navigate("/"); // Redirect to home page
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      });
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Student Profile & Preferences</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Personal Information */}
        <div className="profile-section">
          <h3>Personal Information</h3>

          <div className="input-group">
            <label>Name:</label>
            <input type="text" name="name" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Gender:</label>
            <select name="gender" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Age:</label>
            <input type="number" name="age" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Major:</label>
            <input type="text" name="major" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Language Spoken:</label>
            <input type="text" name="language" onChange={handleChange} required />
          </div>

          {/* New Contact Field */}
          <div className="input-group">
            <label>Contact Number:</label>
            <input
              type="text"
              name="contact"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Roommate Preferences */}
        <div className="profile-section">
          <h3>Roommate Preferences</h3>

          <div className="input-group">
            <label>Early Bird or Night Owl?</label>
            <select name="earlyBird" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Early Bird">Early Bird</option>
              <option value="Night Owl">Night Owl</option>
            </select>
          </div>

          <div className="input-group">
            <label>Cleanliness Habits:</label>
            <select name="cleanliness" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Very Tidy">Very Tidy</option>
              <option value="Moderately Tidy">Moderately Tidy</option>
              <option value="Messy">Messy</option>
            </select>
          </div>

          <div className="input-group">
            <label>Diet Preference:</label>
            <select name="diet" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
          </div>

          <div className="input-group">
            <label>Visitors Allowed?</label>
            <select name="visitors" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="No Visitors">No Visitors</option>
              <option value="Occasionally">Occasionally</option>
              <option value="Anytime">Anytime</option>
            </select>
          </div>

          <div className="input-group">
            <label>Same Language Preference?</label>
            <select name="sameLanguage" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Doesn't Matter">Either one is fine</option>
            </select>
          </div>
        </div>

        <button type="submit" className="profile-submit">
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
