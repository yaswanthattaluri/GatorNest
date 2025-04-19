import { useState, useEffect } from "react";
import Table from "./Table";
import Card from "./Card"; 
import "../styles/RoomFinder.css";

const RoomFinder = () => {
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const flatTypes = ["1B1B", "2B2B", "3B3B"];
  const columns = ["Room Number", "Dorm Number", "Students Enrolled", "Shared Rooms Available", "Price", "Actions"];
  
  // Admin email for inquiries
  const adminEmail = "admin@gatornest.com";

  // Mock rooms data - you'll replace this with actual API data
  const mockRooms = {
    "1B1B": [
      {
        name: "Room A",
        type: "Single",
        roomNumber: 7075,
        price: 1000,
        vacancy: 10,
        dormNumber: "1B1B",
        studentsEnrolled: 3,
        sharedRoomsAvailable: 7
      },
      {
        name: "Room E",
        type: "Triple",
        roomNumber: 140,
        price: 1000,
        vacancy: 4,
        dormNumber: "1B1B",
        studentsEnrolled: 1,
        sharedRoomsAvailable: 3
      }
    ],
    "2B2B": [
      {
        name: "Room B",
        type: "Double",
        roomNumber: 1234,
        price: 1000,
        vacancy: 5,
        dormNumber: "2B2B",
        studentsEnrolled: 3,
        sharedRoomsAvailable: 2
      },
      {
        name: "Room D",
        type: "Triple",
        roomNumber: 130,
        price: 1000,
        vacancy: 2,
        dormNumber: "2B2B",
        studentsEnrolled: 1,
        sharedRoomsAvailable: 1
      }
    ],
    "3B3B": [
      {
        name: "Room C",
        type: "Single",
        roomNumber: 120,
        price: 1000,
        vacancy: 10,
        dormNumber: "3B3B",
        studentsEnrolled: 3,
        sharedRoomsAvailable: 7
      }
    ]
  };

  useEffect(() => {
    // Get user information from localStorage if available
    const token = localStorage.getItem("token");
    if (token) {
      // Normally you'd fetch user data from an API
      // For now, we'll use mock data
      setUserEmail("student@university.edu");
      setUserName("John Doe");
    }

    // Load mock data for demonstration
    setRoomData(mockRooms);
    setLoading(false);
  }, []);

  // Handle expressing interest in a room
  const handleExpressInterest = (room) => {
    // Construct email subject and body
    const subject = `Interest in Room ${room.roomNumber} (${room.dormNumber})`;
    const body = `Hello,\n\nI am interested in Room ${room.roomNumber} in the ${room.dormNumber} dorm.\n\nPlease contact me for more information.\n\nThank you,\n${userName || "A Student"}`;
    
    // Create mailto link
    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
  };

  // Format room data for the table
  const formatRoomDataForTable = (rooms) => {
    return rooms.map((room) => {
      return {
        "Room Number": room.roomNumber,
        "Dorm Number": room.dormNumber,
        "Students Enrolled": room.studentsEnrolled,
        "Shared Rooms Available": room.sharedRoomsAvailable,
        "Price": `$${room.price}`,
        "Actions": (
          <button 
            className="interest-button" 
            onClick={() => handleExpressInterest(room)}
          >
            I am Interested
          </button>
        )
      };
    });
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
          {mockRooms[selectedFlat] && mockRooms[selectedFlat].length > 0 ? (
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
                  {mockRooms[selectedFlat].map((room) => (
                    <tr key={room.roomNumber}>
                      <td>{room.roomNumber}</td>
                      <td>{room.dormNumber}</td>
                      <td>{room.studentsEnrolled}</td>
                      <td>{room.sharedRoomsAvailable}</td>
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