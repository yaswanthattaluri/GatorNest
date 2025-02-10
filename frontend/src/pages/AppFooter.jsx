import React from "react";
import "../styles/AppFooter.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StaffLogin from "./StaffLogin.jsx";


const AppFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <h3>Contact Us</h3>
        <p><strong>Phone:</strong> 1234567890</p>
        <p><strong>Address:</strong> Florida</p>
      </div>
      <div className="footer-column">
        <h3>Office Hours</h3>
        <p>Monday - Friday: 9 AM - 5 PM</p>
        <p>Saturday - Sunday: Closed</p>
      </div>
      <div className="footer-column">
        <a href="/StaffLogin" className="footer-button">Staff Login</a>
      </div>
    </footer>
  );
};

export default AppFooter;
