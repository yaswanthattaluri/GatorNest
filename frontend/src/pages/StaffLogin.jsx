import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StaffLogin.css";

function StaffLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(""); // To store API error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.username, // Assuming username is email in backend
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Admin Login Success:", data);

        // Store admin token
        localStorage.setItem("adminToken", data.token);

        // Set a flag to differentiate from student login
        localStorage.setItem("isAdmin", "true");

        // Dispatch a storage event to update UI
        window.dispatchEvent(new Event("storage"));

        alert(`Login successful for ${formData.username}!`);
        navigate("/staffhome"); // Redirect to staff home
      } else {
        setError(data.error || "Login failed! Invalid credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="StaffLogin-container">
      <div className="StaffLogin-card">
        <h2 className="StaffLogin-heading">Admin Login</h2>
        {error && <p className="StaffLogin-error">{error}</p>} {/* Display errors */}
        <form onSubmit={handleSubmit} className="StaffLogin-form">
          <label className="StaffLogin-label">Username (Email):</label>
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
