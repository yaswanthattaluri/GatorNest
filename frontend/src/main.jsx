import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import logo from "./assets/logo.png";
import AppFooter from "./pages/AppFooter.jsx";
import FloatingWidget from "./pages/FloatingWidget.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Token exists -> User is logged in
    } else {
      setIsLoggedIn(false); // No token -> User is logged out
    }
  }, []);

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    setIsLoggedIn(false);
    alert("You have been logged out!");
    window.location.href = "/"; // Redirect to home after logout
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
          background: "#005f99",
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
            Welcome to GatorNest
          </h1>
        </div>

        {/* Navbar with Conditional Rendering */}
        <nav style={{ display: "flex", gap: "25px" }}>
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

          {isLoggedIn ? (
            <>
              <a
                href="/profile"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                Profile
              </a>
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
                href="/faq"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                FAQ
              </a>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#ffa500",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                Student Logout
              </button>
            </>
          ) : (
            <>
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
