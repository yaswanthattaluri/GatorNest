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
    setError(null);
    setLoading(true);
  
    try {
      const response = await axios.get('http://localhost:8080/api/students/search', {
        params: { type: searchType, term: searchTerm }
      });
  
      setSearchResults(response.data.length > 0 ? response.data : []);
      if (response.data.length === 0) {
        setError('No students found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student data.');
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
          <option value="id">Search by Student ID</option>
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
              <tr key={student.id}>
                <td>{student.name || 'N/A'}</td>
                <td>{student.id || 'N/A'}</td>
                <td>{student.room_id !== null ? student.room_id : 'N/A'}</td>
                <td>{student.dorm_preference || 'N/A'}</td>
                <td>{student.phone || 'N/A'}</td>
                <td>{student.age || 'N/A'}</td>
                <td>{student.gender || 'N/A'}</td>
                <td>{student.food_preference || 'N/A'}</td>
                <td>{student.preference || 'N/A'}</td>
                <td>{student.cleanliness || 'N/A'}</td>
                <td>{student.people_over || 'N/A'}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}

export default StudentSearch;