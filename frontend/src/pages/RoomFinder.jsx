import { useState, useEffect } from "react";
import Table from "./Table";
import Card from "./Card"; // Import Card component
import "../styles/RoomFinder.css";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const RoomFinder = () => {
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const flatTypes = ["1B1B", "2B2B", "3B3B"];
  const columns = ["Room Number", "Dorm Number", "Students Enrolled", "Shared Rooms Available", "Price"];
  const mockRooms = [
  {
    name: "Room A",
    type: "Single",
    roomNumber: 7075,
    price: 1000,
    vacancy: 10,
    dormNumber: "1B1B", // ✅ Add this field
    studentsEnrolled: 3,
    sharedRoomsAvailable: 7
  },
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
    name: "Room C",
    type: "Single",
    roomNumber: 120,
    price: 1000,
    vacancy: 10,
    dormNumber: "3B3B",
    studentsEnrolled: 3,
    sharedRoomsAvailable: 7
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
];


  useEffect(() => {
    const fetchRooms = async () => {
      // setLoading(true);
      setError(null); // Reset error before fetching
      // try {
      //   const response = await fetch(`http://localhost:8080/api/rooms`, {
      //     method: "GET",
      //     redirect: "follow",
      //   });

      //   if (!response.ok) {
      //     const errorText = await response.text();
      //     throw new Error(`Failed to fetch data: ${errorText}`);
      //   }

      //   const data = await response.json();
        setRoomData(mockRooms);
      // } catch (err) {
      //   setError(err.message);
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchRooms();
  }, []);

  const filteredData = roomData.filter((room) => room.flatType === selectedFlat);

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
          <div className="table-container">
            <Table columns={columns} data={filteredData} />
          </div>
        </>
      )}
    </div>
  );
};

export default RoomFinder;
