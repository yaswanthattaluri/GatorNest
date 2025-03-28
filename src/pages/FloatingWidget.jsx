import React, { useState } from "react";
import { Mail, Phone, FileText, MessageCircle } from "lucide-react"; // Import icons
import Registration from "../pages/registration.jsx";
import { Link } from "react-router-dom";


const FloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle widget

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        zIndex: 9999, // Ensure it's on top
      }}
    >
      {/* Expandable Icons */}
      {isOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "white",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <a href="mailto:gatorsnestfl@gmail.com" style={{ textDecoration: "none", color: "#005f99" }}>
            <Mail size={24} /> Email
          </a>
          <a href="tel:+1234567890" style={{ textDecoration: "none", color: "#005f99" }}>
            <Phone size={24} /> Call
          </a>
        </div>
      )}

      {/* Main Floating Button */}
      <div
        style={{
          backgroundColor: "#ffa500",
          color: "white",
          padding: "15px",
          borderRadius: "50%",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          width: "60px",
          height: "60px",
        }}
        onClick={() => setIsOpen(!isOpen)} // Toggle state
      >
        <MessageCircle size={30} />
      </div>
    </div>
  );
};

export default FloatingWidget;
