import { useState, useEffect } from "react";
import "../styles/FindRoommate.css"; 

function FindRoommate() {
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteProfiles, setFavoriteProfiles] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    gender: "",
    sleepSchedule: "",
    cleanliness: "",
    socialPreference: ""
  });
  
  // Mock data for student profiles - replace with API call later
  const mockProfiles = [
    {
      id: 1,
      name: "Student Name",
      gender: "Female",
      preferences: {
        sleepSchedule: "Early Bird",
        cleanliness: "Very Tidy",
        socialPreference: "Private Space"
      }
    },
    {
      id: 2,
      name: "Student Name 2",
      gender: "Male",
      preferences: {
        sleepSchedule: "Night Owl",
        cleanliness: "Moderately Tidy",
        socialPreference: "Occasional Visitors"
      }
    },
    {
      id: 3,
      name: "Student Name 3",
      gender: "Female",
      preferences: {
        sleepSchedule: "Early Bird",
        cleanliness: "Very Tidy",
        socialPreference: "Social Space"
      }
    },
    {
      id: 4,
      name: "Student Name 4",
      gender: "Male",
      preferences: {
        sleepSchedule: "Night Owl",
        cleanliness: "Messy",
        socialPreference: "Social Space"
      }
    }
  ];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      const token = localStorage.getItem("token"); // Retrieve JWT token
  
      try {
        const response = await fetch("http://localhost:8080/api/student/get-all", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Ensure the response structure matches the expected format
        const formattedData = data.map(student => ({
          id: student.id,
          name: student.name,
          gender: student.gender,
          preferences: {
            sleepSchedule: student.sleep_schedule || "Not Specified",
            cleanliness: student.cleanliness || "Not Specified",
            socialPreference: student.social_preference || "Not Specified",
          },
        }));
  
        setStudentProfiles(formattedData);
        setFilteredProfiles(formattedData);
      } catch (err) {
        console.error("Error fetching student profiles:", err);
        setError("Failed to fetch student profiles");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  useEffect(() => {
    let result = [...studentProfiles];
    
    // Filter by gender
    if (filters.gender) {
      result = result.filter(profile => profile.gender === filters.gender);
    }
    
    // Filter by sleep schedule
    if (filters.sleepSchedule) {
      result = result.filter(profile => profile.preferences.sleepSchedule === filters.sleepSchedule);
    }
    
    // Filter by cleanliness preference
    if (filters.cleanliness) {
      result = result.filter(profile => profile.preferences.cleanliness === filters.cleanliness);
    }
    
    // Filter by social preference
    if (filters.socialPreference) {
      result = result.filter(profile => profile.preferences.socialPreference === filters.socialPreference);
    }
    
    setFilteredProfiles(result);
  }, [filters, studentProfiles]);

  // Toggle favorite status
  const toggleFavorite = (profileId) => {
    const isFavorite = favoriteProfiles.includes(profileId);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favoriteProfiles.filter(id => id !== profileId);
    } else {
      updatedFavorites = [...favoriteProfiles, profileId];
    }
    
    setFavoriteProfiles(updatedFavorites);
    localStorage.setItem('favoriteRoommates', JSON.stringify(updatedFavorites));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      gender: "",
      sleepSchedule: "",
      cleanliness: "",
      socialPreference: ""
    });
  };

  // Unique lists for filter options
  const uniqueCleanliness = [...new Set(studentProfiles.map(profile => profile.preferences.cleanliness))];
  const uniqueSocialPreferences = [...new Set(studentProfiles.map(profile => profile.preferences.socialPreference))];

  return (
    <div className="find-roommate-container">
      <section className="roommate-header">
        <h1>Find Roommates</h1>
        <p>Connect with potential roommates based on your preferences</p>
      </section>

      <section className="filters-section">
        <h2>Filters</h2>
        <div className="filter-options">
          <div className="filter-group">
            <label htmlFor="gender">Gender:</label>
            <select 
              id="gender"
              name="gender" 
              value={filters.gender} 
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sleepSchedule">Sleep Schedule:</label>
            <select 
              id="sleepSchedule"
              name="sleepSchedule" 
              value={filters.sleepSchedule} 
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="Early Bird">Early Bird</option>
              <option value="Night Owl">Night Owl</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="cleanliness">Cleanliness:</label>
            <select 
              id="cleanliness"
              name="cleanliness" 
              value={filters.cleanliness} 
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              {uniqueCleanliness.map(clean => (
                <option key={clean} value={clean}>{clean}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="socialPreference">Social Preference:</label>
            <select 
              id="socialPreference"
              name="socialPreference" 
              value={filters.socialPreference} 
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              {uniqueSocialPreferences.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </div>
          
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      <section className="student-profiles">
        <h2>Student Profiles {filteredProfiles.length > 0 && `(${filteredProfiles.length} Found)`}</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profiles...</p>
          </div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredProfiles.length === 0 ? (
          <div className="no-results">
            <p>No profiles match your filter criteria</p>
            <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="profiles-grid">
            {filteredProfiles.map(profile => (
              <div key={profile.id} className="profile-card">
                <div className="profile-header">
                  <h3>{profile.name}</h3>
                  <button 
                    className={`favorite-btn ${favoriteProfiles.includes(profile.id) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(profile.id)}
                    aria-label={favoriteProfiles.includes(profile.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favoriteProfiles.includes(profile.id) ? '★' : '☆'}
                  </button>
                </div>
                
                <div className="profile-content">
                  <div className="profile-info">
                    <p><strong>Gender:</strong> {profile.gender}</p>
                  </div>
                  
                  <div className="profile-preferences">
                    <p><strong>Preferences:</strong></p>
                    <p className="preference-line">{profile.preferences.sleepSchedule}</p>
                    <p className="preference-line">{profile.preferences.cleanliness}</p>
                    <p className="preference-line">{profile.preferences.socialPreference}</p>
                  </div>
                </div>
                
                <div className="profile-actions">
                  <button className="contact-btn">Contact</button>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {favoriteProfiles.length > 0 && (
        <section className="favorites-section">
          <h2>Your Favorites</h2>
          <div className="profiles-grid">
            {studentProfiles
              .filter(profile => favoriteProfiles.includes(profile.id))
              .map(profile => (
                <div key={profile.id} className="profile-card favorite">
                  <div className="profile-header">
                    <h3>{profile.name}</h3>
                    <button 
                      className="favorite-btn favorited"
                      onClick={() => toggleFavorite(profile.id)}
                      aria-label="Remove from favorites"
                    >
                      ★
                    </button>
                  </div>
                  
                  <div className="profile-content">
                    <div className="profile-info">
                      <p><strong>Gender:</strong> {profile.gender}</p>
                    </div>
                    
                    <div className="profile-preferences">
                      <p><strong>Preferences:</strong></p>
                      <p className="preference-line">{profile.preferences.sleepSchedule}</p>
                      <p className="preference-line">{profile.preferences.cleanliness}</p>
                      <p className="preference-line">{profile.preferences.socialPreference}</p>
                    </div>
                  </div>
                  
                  <div className="profile-actions">
                    <button className="contact-btn">Contact</button>
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default FindRoommate;