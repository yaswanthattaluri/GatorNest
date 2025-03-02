import { useNavigate } from "react-router-dom";
import cleanroom from "../assets/cleanroom.png";
import gym from "../assets/gym.png";
import "../App.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Section 1 */}
      <section className="half-page-section">
        <div className="text-content">
          <h2>Why Choose Our Dorms?</h2>
          <ul>
            <li>
              <strong>Furnished Rooms</strong> - Bed, mattress, desk, chair, closet/wardrobe, and dresser.
            </li>
            <li>
              <strong>Utilities Included</strong> - Electricity, water, heating, and cooling.
            </li>
            <li>
              <strong>High-Speed Internet</strong> - Wi-Fi access throughout the dorm.
            </li>
            <li>
              <strong>Laundry Facilities</strong> - On-site washers and dryers, sometimes requiring payment via coins or a card.
            </li>
          </ul>
        </div>
        <div className="image-content">
          <img src={cleanroom} alt="Dorm Image" />
        </div>
      </section>

      {/* Section 2 */}
      <section className="half-page-section">
        <div className="image-content">
          <img src={gym} alt="Community Image" />
        </div>
        <div className="text-content">
          <h2>Community Benefits</h2>
          <ul>
            <li>
              <strong>Events and Activities</strong> - Regular community gatherings to help students connect.
            </li>
            <li>
              <strong>Supportive Environment</strong> - Resident advisors available for guidance.
            </li>
            <li>
              <strong>Study Areas</strong> - Quiet spaces designed for productivity.
            </li>
            <li>
              <strong>Fitness Facilities</strong> - On-site gyms to maintain a healthy lifestyle.
            </li>
          </ul>
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={() => navigate("/profile")} className="btn">Profile</button>
        <button onClick={() => navigate("/room-finder")} className="btn">Find Your Room</button>
      </div>
    </div>
  );
};

export default HomePage;


