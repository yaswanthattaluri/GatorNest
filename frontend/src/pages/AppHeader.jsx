import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AppHeader.css";

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container" onClick={() => navigate("/")}>
          <span className="logo-text">GatorNest</span>
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation menu */}
        <nav className={`nav-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <button 
            className={`nav-item ${isActive("/")}`} 
            onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
          >
            Home
          </button>
          <button 
            className={`nav-item ${isActive("/registration")}`} 
            onClick={() => { navigate("/registration"); setMobileMenuOpen(false); }}
          >
            Apply Now
          </button>
          <button 
            className={`nav-item ${isActive("/faq")}`} 
            onClick={() => { navigate("/faq"); setMobileMenuOpen(false); }}
          >
            FAQ
          </button>
          <button 
            className={`nav-item login-btn ${isActive("/studentlogin")}`} 
            onClick={() => { navigate("/studentlogin"); setMobileMenuOpen(false); }}
          >
            Student Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;