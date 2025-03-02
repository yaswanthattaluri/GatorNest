import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import logo from "./assets/logo.png";
import AppFooter from "./pages/AppFooter.jsx";
import FloatingWidget from "./pages/FloatingWidget.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
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
          <h1 style={{ margin: 0, fontSize: "30px", color: "#ffa500" }}>Welcome to Gatornest</h1>
        </div>

        <nav style={{ display: "flex", gap: "25px" }}>

          
          <a href="/" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
            Home
          </a>
          <a href="/registration" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
            Registration
          </a>
          <a href="/studentlogin" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
            Student Login
          </a>
          <a href="/profile" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
            Profile
          </a>
          <a href="/roomfinder" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
            Find Room
          </a>
      
          <a href="/faq" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
            FAQ
          </a>
          

        </nav>
      </header>

      <main style={{ flex: "1", padding: "20px", background: "white" }}>
        <App />
      </main>

              {/* Floating Widget Placed Here */}
      <FloatingWidget />
      <nav>
      <a href="/floatingwidget" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>Widget</a>
      </nav>

      <footer>
        <AppFooter />
      </footer>

    </div>
  </StrictMode>
);