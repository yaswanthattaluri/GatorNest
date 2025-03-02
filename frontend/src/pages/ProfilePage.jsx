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
    alert("Profile preferences saved!");
    navigate("/"); // Redirect to home after submitting
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Student Profile & Preferences</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Personal Information */}
        <div className="profile-section">
          <h3>Personal Information</h3>
          <label>Name:</label>
          <input type="text" name="name" onChange={handleChange} required />

          <label>Gender:</label>
          <select name="gender" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Age:</label>
          <input type="number" name="age" onChange={handleChange} required />

          <label>Major:</label>
          <input type="text" name="major" onChange={handleChange} required />

          <label>Language Spoken:</label>
          <input type="text" name="language" onChange={handleChange} required />
        </div>

        {/* Preferences Section */}
        <div className="profile-section">
          <h3>Roommate Preferences</h3>

          <label>Early Bird or Night Owl?</label>
          <select name="earlyBird" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Early Bird">Early Bird</option>
            <option value="Night Owl">Night Owl</option>
          </select>

          <label>Cleanliness Habits:</label>
          <select name="cleanliness" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Very Tidy">Very Tidy</option>
            <option value="Moderately Tidy">Moderately Tidy</option>
            <option value="Messy">Messy</option>
          </select>

          <label>Diet Preference:</label>
          <select name="diet" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>

          <label>Visitors Allowed?</label>
          <select name="visitors" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="No Visitors">No Visitors</option>
            <option value="Occasionally">Occasionally</option>
            <option value="Anytime">Anytime</option>
          </select>

          <label>Same Language Preference?</label>
          <select name="sameLanguage" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Doesn't Matter">Either one is fine</option>
          </select>
        </div>

        <button type="submit" className="profile-submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default ProfilePage;
