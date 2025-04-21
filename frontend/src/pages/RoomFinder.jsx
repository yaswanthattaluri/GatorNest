import { useState, useEffect } from "react";
import Table from "./Table";
import Card from "./Card"; 
import "../styles/RoomFinder.css";

const RoomFinder = () => {
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [roomData, setRoomData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const flatTypes = ["1B1B", "2B2B", "3B3B"];
  const columns = ["Room Number", "Type", "Students Enrolled", "Vacancy", "Price", "Actions"];
  
  // Admin email for inquiries
  const adminEmail = "admin@gatornest.com";

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/rooms", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rooms = await response.json();
        
        // Group rooms by type
        const groupedRooms = rooms.reduce((acc, room) => {
          const type = room.type;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(room);
          return acc;
        }, {});

        setRoomData(groupedRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    // Get user information from localStorage if available
    const token = localStorage.getItem("token");
    if (token) {
      // Normally you'd fetch user data from an API
      // For now, we'll use mock data
      setUserEmail("student@university.edu");
      setUserName("John Doe");
    }

    fetchRooms();
  }, []);

  // Handle expressing interest in a room
  const handleExpressInterest = async (room) => {
    try {
      const token = localStorage.getItem("token");
      
      // First, get the room ID using the room number
      const roomResponse = await fetch(`http://localhost:8080/api/rooms/number/${room.room_number}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!roomResponse.ok) {
        throw new Error(`Failed to get room details: ${roomResponse.status}`);
      }

      const roomData = await roomResponse.json();
      console.log("Room data:", roomData); // Debug log
      
      // Get the room ID, handling both ID and id cases
      const roomId = roomData.ID || roomData.id;
      if (!roomId) {
        console.error("Invalid room data:", roomData);
        throw new Error("Invalid room data received - no room ID found");
      }
      
      // Then, join the room using the room ID
      const joinResponse = await fetch(`http://localhost:8080/api/rooms/${roomId}/join`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!joinResponse.ok) {
        const errorData = await joinResponse.json();
        throw new Error(errorData.error || `Failed to join room: ${joinResponse.status}`);
      }

      // Show success message
      alert("Successfully joined the room! The room price has been added to your pending dues.");
      
      // Refresh the room data to update the UI
      const roomsResponse = await fetch("http://localhost:8080/api/rooms", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!roomsResponse.ok) {
        throw new Error(`Failed to refresh rooms: ${roomsResponse.status}`);
      }

      const rooms = await roomsResponse.json();
      
      // Group rooms by type
      const groupedRooms = rooms.reduce((acc, room) => {
        const type = room.type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(room);
        return acc;
      }, {});

      setRoomData(groupedRooms);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to join room. Please try again later.");
    }
  };

  return (
    <div className="roomfinder-container">
      <h1 className="title">Select Your Flat Type</h1>
      <div className="flat-selection">
        {flatTypes.map((flat) => (
          <Card 
            key={flat} 
            onClick={() => setSelectedFlat(flat)} 
            isSelected={selectedFlat === flat}
          >
            {flat}
          </Card>
        ))}
      </div>
      

      {loading && <p>Loading rooms...</p>}
      {error && <p className="error">Error: {error}</p>}

      {selectedFlat && !loading && (
        <>
          <h2 className="subtitle">Room Details for {selectedFlat}</h2>
          {roomData[selectedFlat] && roomData[selectedFlat].length > 0 ? (
            <div className="table-container">
              <table className="room-table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roomData[selectedFlat].map((room) => (
                    <tr key={room.room_number}>
                      <td>{room.room_number}</td>
                      <td>{room.type}</td>
                      <td>{room.students ? room.students.length : 0}</td>
                      <td>{room.vacancy}</td>
                      <td>${room.price}</td>
                      <td>
                        <button 
                          className="interest-button" 
                          onClick={() => handleExpressInterest(room)}
                        >
                          I am Interested
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-rooms">No rooms available for this flat type.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RoomFinder;