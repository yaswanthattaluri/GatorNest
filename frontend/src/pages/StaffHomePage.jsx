import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; // Reuse homepage styles
import "../styles/StaffHomePage.css"; // Add staff-specific styles
import gymImage from "../assets/gym.png";
import dormRoom from "../assets/cleanroom.png";
import gatorStatue from "../assets/ufp3.jpg";

function StaffHomePage() {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState("Staff Member");
  
  // Check if staff is logged in
  useEffect(() => {
    const staffToken = localStorage.getItem("staffToken");
    const isStaff = localStorage.getItem("isStaff");
    
    if (!staffToken || isStaff !== "true") {
      navigate("/stafflogin");
    } else {
      fetchStaffProfile();
      
      // Trigger a storage event to ensure the header updates
      window.dispatchEvent(new Event('loginStatusChange'));
    }
  }, [navigate]);
  
  const fetchStaffProfile = () => {
    const staffToken = localStorage.getItem("staffToken");
    
    // You would replace this with actual API call
    // For now, just use mock data
    setStaffName("Admin");
    
    /* Uncomment when backend is ready
    fetch("http://localhost:8080/api/staff/profile", {
      headers: { Authorization: `Bearer ${staffToken}` }
    })
    .then(res => res.json())
    .then(data => setStaffName(data.name))
    .catch(err => {
      console.error("Error fetching staff profile:", err);
      setStaffName("Admin"); // Fallback
    });
    */
  };

  return (
    <div className="homepage-container">
      {/* Staff Dashboard Header */}
      <section className="hero-banner" style={{ background: "#003366" }}>
        <div className="hero-content">
          <h1>Staff Dashboard</h1>
          <p>Welcome back, {staffName}! Manage GatorNest housing operations from here.</p>
        </div>
      </section>

      {/* Staff Management Sections */}
      <section className="combined-section">
        <h2>Housing Management</h2>
        <div className="combined-grid">
          <div className="dorm-card">
            <img src={dormRoom} alt="Dorm Management" />
            <h3>Dorm Management</h3>
            <p>Manage room assignments and maintenance requests</p>
          </div>
          <div className="dorm-card">
            <img src={gatorStatue} alt="Student Records" />
            <h3>Student Records</h3>
            <p>Access and update student housing information</p>
          </div>
          <div className="amenity">
            <img src={gymImage} alt="Facility Management" />
            <h3>Facility Management</h3>
            <p>Schedule maintenance and track facility usage</p>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="community-section">
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          
        </div>
      </section>
    </div>
  );
}

export default StaffHomePage;