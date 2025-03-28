import React, { useState } from 'react';
import axios from 'axios';
import "../styles/SearchStudent.css";

function StudentSearch() {
  const [searchType, setSearchType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    // Reset previous error and set loading
    setError(null);
    setLoading(true);

    try {
      // Modify the API endpoint to match your backend
      const response = await axios.get('/api/students/search', {
        params: {
          type: searchType,
          term: searchTerm
        }
      });

      // Ensure the response is an array
      const resultsArray = Array.isArray(response.data) 
        ? response.data 
        : (response.data.students || []);

      setSearchResults(resultsArray);
      
      // If no results found, set an informative message
      if (resultsArray.length === 0) {
        setError('No students found matching the search criteria.');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.response?.data?.message || 'Failed to fetch student data. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-search-container">
      <h1>Search Student Details</h1>
      <div className="search-controls">
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)}
          className="search-select"
        >
          <option value="name">Search by Name</option>
          <option value="studentId">Search by Student ID</option>
          <option value="roomNumber">Search by Room Number</option>
        </select>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Enter ${searchType}`}
          className="search-input"
        />
        <button 
          onClick={handleSearch} 
          className="search-button" 
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <table className="student-results-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Room Number</th>
              <th>Dorm Number</th>
              <th>Contact Number</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Dietary Restrictions</th>
              <th>Sleep Schedule</th>
              <th>Cleanliness</th>
              <th>Social Preference</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((student) => (
              <tr key={student.studentId || Math.random()}>
                <td>{student.name}</td>
                <td>{student.studentId}</td>
                <td>{student.roomNumber}</td>
                <td>{student.dormNumber}</td>
                <td>{student.contactNumber}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.preferences?.dietaryRestrictions || 'N/A'}</td>
                <td>{student.preferences?.sleepSchedule || 'N/A'}</td>
                <td>{student.preferences?.cleanliness || 'N/A'}</td>
                <td>{student.preferences?.socialPreference || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentSearch;