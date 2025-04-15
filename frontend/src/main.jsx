import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import logo from "./assets/logo.png";
import AppFooter from "./pages/AppFooter.jsx";
import FloatingWidget from "./pages/FloatingWidget.jsx";
import defaultProfilePic from "./assets/default-image.png"; // Add a default profile picture

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  </StrictMode>
);

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(defaultProfilePic);

  // Check login status on initial load, route changes, and localStorage changes
  useEffect(() => {
    function checkLoginStatus() {
      try {
        const token = localStorage.getItem("token");
        const staffToken = localStorage.getItem("staffToken");
        const isStaff = localStorage.getItem("isStaff");
        const profilePic = localStorage.getItem("profilePic");
        
        console.log("Checking login status - Staff:", isStaff, "Staff Token:", staffToken);
        
        if (token) {
          setIsLoggedIn(true); // Token exists -> User is logged in
          if (profilePic) {
            setUserProfilePic(profilePic);
          }
        } else {
          setIsLoggedIn(false); // No token -> User is logged out
        }
        
        if (staffToken && isStaff === "true") {
          setIsStaffLoggedIn(true); // Staff token exists -> Staff is logged in
          console.log("Staff is logged in");
        } else {
          setIsStaffLoggedIn(false); // No staff token -> Staff is logged out
          console.log("Staff is NOT logged in");
        }
      } catch (err) {
        console.error("Error checking login status:", err);
        // Default to logged out state if there's an error
        setIsLoggedIn(false);
        setIsStaffLoggedIn(false);
      }
    }
    
    // Check immediately on component mount
    checkLoginStatus();
    
    // Set up listeners for storage events (login/logout)
    const handleStorageChange = () => {
      console.log("Storage changed, checking login status");
      checkLoginStatus();
      // Force component update by incrementing reload flag
      setReloadFlag(prev => prev + 1);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for direct component communication
    window.addEventListener('loginStatusChange', handleStorageChange);
    
    // Add path change detection
    const intervalId = setInterval(() => {
      checkLoginStatus();
    }, 1000); // Check every second
    
    // Clean up listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChange', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [reloadFlag]); // Re-run when reload flag changes

  // Handle student logout functionality
  const handleLogout = () => {
    try {
      localStorage.removeItem("token"); // Remove token on logout
      localStorage.removeItem("profilePic"); // Remove profile pic
      setIsLoggedIn(false);
      
      // Trigger event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      alert("You have been logged out!");
      window.location.href = "/"; // Redirect to home after logout
    } catch (err) {
      console.error("Error during logout:", err);
      alert("There was an error logging out. Please try again.");
    }
  };
  
  // Handle staff logout functionality
  const handleStaffLogout = (e) => {
    e.preventDefault(); // Prevent default link behavior
    try {
      localStorage.removeItem("staffToken"); // Remove staff token on logout
      localStorage.removeItem("isStaff"); // Remove staff flag
      setIsStaffLoggedIn(false);
      
      // Trigger event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      alert("Staff logged out successfully!");
      window.location.href = "/"; // Redirect to home after logout
    } catch (err) {
      console.error("Error during staff logout:", err);
      alert("There was an error logging out. Please try again.");
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <header
        style={{
          padding: "30px",
          background: isStaffLoggedIn ? "#003366" : "#005f99", // Different color for staff
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "6px solid #ffa500",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logo} alt="GatorNest Logo" style={{ height: "70px" }} />
          <h1 style={{ margin: 0, fontSize: "30px", color: "#ffa500" }}>
            {isStaffLoggedIn ? "GatorNest Admin" : "Welcome to GatorNest"}
          </h1>
        </div>

        {/* Navbar with Conditional Rendering */}
        <nav style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <a
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
            }}
          >
            Home
          </a>

          {isStaffLoggedIn ? (
            <>
              {/* Staff Navigation Items */}
              <a
                href="/staffhome"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Dashboard
              </a>
              <a
                href="/managestudents"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Search Students
              </a>
              <a
                href="/managerooms"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Manage Rooms
              </a>
              <a
                href="/maintenanceinbox"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                View Maintenance Requests
              </a>
              <a
                href="/"
                onClick={handleStaffLogout}
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                  cursor: "pointer"
                }}
              >
                Logout
              </a>
            </>
          ) : isLoggedIn ? (
            <>
              {/* Student Logged In Navigation Items */}
              <a
                href="/roomfinder"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Find Room
              </a>
              <a
                href="/findroommate"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Find Roommate
              </a>
              <a
                href="/maintenancerequest"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Maintenance Request
              </a>
              <a
                href="/faq"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                FAQ
              </a>
              
              {/* Profile Dropdown */}
              <div 
                style={{ 
                  position: 'relative', 
                  cursor: 'pointer' 
                }}
                onClick={toggleDropdown}
              >
                <img 
                  src={userProfilePic} 
                  alt="Profile" 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
                {isDropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      zIndex: 10,
                      width: '150px'
                    }}
                  >
                    <a 
                      href="/profile"
                      style={{
                        display: 'block',
                        padding: '10px',
                        color: 'black',
                        textDecoration: 'none',
                        borderBottom: '1px solid #ddd'
                      }}
                    >
                      Profile
                    </a>
                    <div 
                      onClick={handleLogout}
                      style={{
                        padding: '10px',
                        color: 'black',
                        cursor: 'pointer'
                      }}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Not Logged In Navigation Items */}
              <a
                href="/registration"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Registration
              </a>
              <a
                href="/studentlogin"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Student Login
              </a>
              <a
                href="/faq"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                FAQ
              </a>
            </>
          )}
        </nav>
      </header>

      {/* Main Section */}
      <main style={{ flex: "1", padding: "20px", background: "white" }}>
        <App />
      </main>

      {/* Floating Widget */}
      <FloatingWidget />

      <footer>
        <AppFooter />
      </footer>
    </div>
  );
}

export default MainApp;