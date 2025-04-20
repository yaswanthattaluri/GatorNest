import { useNavigate } from 'react-router-dom';
import gymImage from "../assets/gym.png";
import dormRoom from "../assets/cleanroom.png";
import gatorStatue from "../assets/ufp3.jpg";
import studyLounge from "../assets/studyspace.jpeg";
import laundryRoom from "../assets/laundry.jpeg";
import React, { useEffect, useState } from "react";



//import campusHero from "../assets/ufp1.jpg";

import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate(); // React Router navigation

  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isStaff = localStorage.getItem("isStaff");

    if (token && isStaff !== "true") {
      setIsStudent(true);
    }
  }, []);
  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to GatorNest</h1>
          <p>Experience premium student living at the heart of the University of Florida.</p>
          {isStudent && (
          <button className="cta-button" onClick={() => navigate('/roomfinder')}>
            Explore Rooms
          </button>
          )}
        </div>
        
      </section>

      {/* Dorm Options & Amenities - Single Row Layout */}
      <section className="combined-section">
        <h2>Explore Our Dorms & Amenities</h2>
        <div className="combined-grid">
          <div className="dorm-card">
            <img src={dormRoom} alt="UF Dorm Room" />
            <h3>Spacious Dorms</h3>
            <p>Fully furnished rooms designed for comfort and convenience</p>
          </div>
          <div className="dorm-card">
            <img src={gatorStatue} alt="Gator Statue" />
            <h3>Campus Vibes</h3>
            <p>Live in the heart of the Gator Nation with easy access to campus life</p>
          </div>
          <div className="amenity">
            <img src={gymImage} alt="UF Gym" />
            <h3>Fully Equipped Gym</h3>
            <p>Modern fitness center with cardio and strength training equipment.</p>

          </div>
          <div className="amenity">
            <img src={laundryRoom} alt="Laundry Facilities" />
            <h3>On-Site Laundry</h3>
            <p>Convenient laundry facilities available within the dorms</p>

          </div>
          <div className="amenity">
            <img src={studyLounge} alt="Study Lounge" />
            <h3>Quiet Study Spaces</h3>
            <p>Peaceful lounges designed for focused study sessions</p>

          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <h2>Join the UF Community</h2>
        <p>Engage in campus events, student activities, and the best university experience.</p>
      </section>
    </div>
  );
};

export default HomePage;
