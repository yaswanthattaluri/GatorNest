import React, { useState } from "react";
import { PlusCircle, Trash2 } from 'lucide-react';
import "../styles/ManageRooms.css";

function ManageRooms() {
  const [action, setAction] = useState("add");
  const [roomDetails, setRoomDetails] = useState({
    roomType: "",
    roomNumber: "",
    price: "",
    dormNumber: ""
  });
  const [deleteRoomNumber, setDeleteRoomNumber] = useState("");

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteInputChange = (e) => {
    setDeleteRoomNumber(e.target.value);
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
                  <label htmlFor="dormNumber">Dorm Number</label>
                  <input
                    id="dormNumber"
                    type="text"
                    name="dormNumber"
                    placeholder="Enter dorm number"
                    value={roomDetails.dormNumber}
                    onChange={handleAddInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              <button className="submit-btn">
                Add Room
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
              <button className="submit-btn">
                Delete Room
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageRooms;