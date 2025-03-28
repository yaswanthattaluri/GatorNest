import { useState, useEffect } from "react";
import Table from "./Table";
import Card from "./Card"; // Import Card component
import "../styles/RoomFinder.css";

const RoomFinder = () => {
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const flatTypes = ["1B1B", "2B2B", "3B3B"];
  const columns = ["Room Number", "Dorm Number", "Students Enrolled", "Shared Rooms Available", "Price"];

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://your-backend-url.com/api/rooms");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setRoomData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
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
      {error && <p className="error">{error}</p>}

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
