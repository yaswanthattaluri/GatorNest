import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import background from "./assets/ufp6.jpg";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(50%)",
        zIndex: -1,
      }}
    />
    <App />
  </StrictMode>
);