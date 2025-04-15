import React, { useEffect, useState } from "react";
import { ClipboardEdit, History } from "lucide-react";
import Card from "./Card";
import MaintenanceHistory from "./MaintenanceHistory";
import "../styles/Maintenance.css";

const Maintenance = () => {
  const [action, setAction] = useState("submit");
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    name: "",
    roomNumber: "",
    priority: "",
    category: "",
    subCategory: "",
    description: "",
    permissionToEnter: "No",
  });
  

  const subcategoryOptions = {
    Plumbing: [
      "Clog", "Disposal", "Leak", "Other", "Shower", "Sink", "Toilet", "Tub", "Water Heater"
    ],
    Electrical: [
      "Breaker", "Carbon Monoxide Detector", "Exhaust Fan", "House Breaker", "Lighting",
      "Main Breaker", "Other", "Outlet", "Service Panel", "Smoke Alarm", "Switch", "Wiring"
    ],
    "Pest Control": [
      "Ants", "Bed Bugs", "Flies", "Other", "Roaches", "Spiders", "Wasp Nest"
    ],
  };

  useEffect(() => {
    fetch("/api/maintenance-requests")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Failed to load maintenance requests:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subCategory: "" } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
        id: Math.floor(Math.random() * 100000),
        date: new Date().toLocaleDateString(),
        name: form.name,
        roomNumber: form.roomNumber,
        category: form.category,
        description: form.description,
        priority: form.priority,
        subCategory: form.subCategory,
        permissionToEnter: form.permissionToEnter,
        status: "Pending",
        completed: "-",
        technicianNotes: "-",
    };

    // Simulate saving to database (replace with real POST request)
    fetch("/api/maintenance-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit");
        return res.json();
      })
      .then((savedRequest) => {
        setRequests((prev) => [...prev, savedRequest]);
        setForm({
            name: "",
            roomNumber: "",
            priority: "",
            category: "",
            subCategory: "",
            description: "",
            permissionToEnter: "No",
          });
          
        alert("Request submitted successfully.");
      })
      .catch((err) => {
        console.error("Failed to save request:", err);
        alert("Submission failed. Please check your backend or try again.");
      });
  };

  return (
    <div className="manage-maintenance-wrapper wider-table-wrapper">
      <div className="manage-maintenance-container wider wide-card">
        <div className="action-selector">
          <button
            onClick={() => setAction("submit")}
            className={`action-btn ${action === "submit" ? "active" : ""}`}
          >
            <ClipboardEdit className="btn-icon" />
            Submit Maintenance Request
          </button>
          <button
            onClick={() => setAction("history")}
            className={`action-btn ${action === "history" ? "active" : ""}`}
          >
            <History className="btn-icon" />
            Request History
          </button>
        </div>

        <div className="form-section">
          {action === "submit" && (
            <form className="add-form" onSubmit={handleSubmit}>
              <h2 className="form-title">Submit a Maintenance Request</h2>
              <div className="form-grid">
              <div className="input-group">
                <label>Name*</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className="input-group">
                <label>Room Number*</label>
                <input
                    type="text"
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className="input-group">
                  <label>Priority*</label>
                  <select name="priority" value={form.priority} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Category*</label>
                  <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Pest Control">Pest Control</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Sub Category*</label>
                  <select
                    name="subCategory"
                    value={form.subCategory}
                    onChange={handleChange}
                    required
                    disabled={!form.category}
                  >
                    <option value="">Select</option>
                    {subcategoryOptions[form.category]?.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Permission to Enter*</label>
                  <select
                    name="permissionToEnter"
                    value={form.permissionToEnter}
                    onChange={handleChange}
                    required
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="input-group full-span no-resize">
                  <label>Full Description*</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          )}

          {action === "history" && (
            <div className="table-scroll-wrapper">
              <MaintenanceHistory requests={requests} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
