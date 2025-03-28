import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StaffLogin.css";

function StaffLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (formData.username && formData.password) {
      console.log("Staff Login Success:", formData.username);

      // Store the staff token in local storage
      localStorage.setItem("staffToken", "mock-staff-token-123");
      
      // Set a staff-specific flag to differentiate from student login
      localStorage.setItem("isStaff", "true");

      // Dispatch a storage event to notify other components of the login change
      // This is important to force the header to update immediately
      window.dispatchEvent(new Event('storage'));

      alert(`Login successful for ${formData.username}!`);
      
      // Redirect to staff home page after login
      navigate("/staffhome");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="StaffLogin-container">
      <div className="StaffLogin-card">
        <h2 className="StaffLogin-heading">Staff Login</h2>
        <form onSubmit={handleSubmit} className="StaffLogin-form">
          <label className="StaffLogin-label">Username:</label>
          <input
            type="text"
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