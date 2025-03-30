import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import "../styles/ManageRooms.css";

function ManageRooms() {
  const [action, setAction] = useState("add");

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
  const [roomDetails, setRoomDetails] = useState({
    name: "",
    roomType: "",
    roomNumber: "",
    price: "",
    vacancies: "",
  });
  const [deleteRoomNumber, setDeleteRoomNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api/rooms"; // Adjust this based on your backend URL

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteInputChange = (e) => {
    setDeleteRoomNumber(e.target.value);
  };

  const handleAddRoom = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Include auth if needed
        },
        body: JSON.stringify({
          name: roomDetails.name,
          type: roomDetails.roomType,
          room_number: parseInt(roomDetails.roomNumber, 10), // Convert to int
          price: parseInt(roomDetails.price, 10), // Convert to int
          vacancy: parseInt(roomDetails.vacancies), 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Room added successfully!");
        setRoomDetails({name: "", roomType: "", roomNumber: "", price: "", vacancies: "" });
      } else {
        alert(data.error || "Failed to add room");
      }
    } catch (error) {
      alert("Error adding room. Please try again.");
    }
    setLoading(false);
  };

  const handleDeleteRoom = async () => {
    if (!deleteRoomNumber) {
      alert("Please enter a valid room number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/number/${deleteRoomNumber}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });      

      const data = await response.json();
      if (response.ok) {
        alert("Room deleted successfully!");
        setDeleteRoomNumber("");
      } else {
        alert(data.error || "Failed to delete room");
      }
    } catch (error) {
      alert("Error deleting room. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="manage-rooms-wrapper">
      <div className="manage-rooms-container">
        <div className="action-selector">
          <button
            onClick={() => setAction("add")}
            className={`action-btn ${action === "add" ? "active" : ""}`}
          >
            <PlusCircle className="btn-icon" />
            Add Rooms
          </button>
          <button
            onClick={() => setAction("delete")}
            className={`action-btn ${action === "delete" ? "active" : ""}`}
          >
            <Trash2 className="btn-icon" />
            Delete Room
          </button>
        </div>

        <div className="form-section">
          {action === "add" && (
            <div className="add-form">
              <h2 className="form-title">Enter Room Details</h2>
              <div className="form-grid">
              <div className="input-group">
                  <label htmlFor="vacancies">Room Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter Room Name"
                    value={roomDetails.name}
                    onChange={handleAddInputChange}
                    className="form-input"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="roomType">Room Type</label>
                  <input
                    id="roomType"
                    type="text"
                    name="roomType"
                    placeholder="Enter room type"
                    value={roomDetails.roomType}
                    onChange={handleAddInputChange}
                    className="form-input"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="roomNumber">Room Number</label>
                  <input
                    id="roomNumber"
                    type="text"
                    name="roomNumber"
                    placeholder="Enter room number"
                    value={roomDetails.roomNumber}
                    onChange={handleAddInputChange}
                    className="form-input"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    type="text"
                    name="price"
                    placeholder="Enter price"
                    value={roomDetails.price}
                    onChange={handleAddInputChange}
                    className="form-input"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="vacancies">Vacancies</label>
                  <input
                    id="vacancies"
                    type="text"
                    name="vacancies"
                    placeholder="Enter vacancies"
                    value={roomDetails.vacancies}
                    onChange={handleAddInputChange}
                    className="form-input"
                  />
                </div>

              </div>
              <button className="submit-btn" onClick={handleAddRoom} disabled={loading}>
                {loading ? "Adding..." : "Add Room"}
              </button>
            </div>
          )}

          {action === "delete" && (
            <div className="delete-form">
              <h2 className="form-title">Delete Room</h2>
              <div className="input-group">
                <label htmlFor="deleteRoomNumber">Room Number</label>
                <input
                  id="deleteRoomNumber"
                  type="text"
                  placeholder="Enter room number"
                  value={deleteRoomNumber}
                  onChange={handleDeleteInputChange}
                  className="form-input"
                />
              </div>
              <button className="submit-btn" onClick={handleDeleteRoom} disabled={loading}>
                {loading ? "Deleting..." : "Delete Room"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageRooms;
