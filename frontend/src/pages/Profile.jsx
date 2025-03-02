import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Profile = () => {
  // Initialize state for profile data
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You could call an API or update a database here
    console.log('Profile updated:', profile);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <div className="gender-options">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={profile.gender === 'Male'}
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={profile.gender === 'Female'}
                onChange={handleChange}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={profile.gender === 'Other'}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

// PropTypes validation
Profile.propTypes = {
  // You could extend the Profile component to accept props if needed
};

export default Profile;
