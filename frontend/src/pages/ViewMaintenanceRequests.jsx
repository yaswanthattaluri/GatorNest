import React, { useState } from "react";
import { Pencil } from "lucide-react";
import "../styles/Maintenance.css";

const AdminMaintenancePanel = () => {
  const [requests, setRequests] = useState([
    {
      id: 10101,
      roomNumber: "A105",
      name: "John Doe",
      priority: "High",
      category: "Plumbing",
      subCategory: "Leak",
      permissionToEnter: "Yes",
      description: "Leak under the kitchen sink.",
      status: "New",
      technicianNotes: "",
      completed: "-"
    },
    {
      id: 10102,
      roomNumber: "B202",
      name: "Jane Smith",
      priority: "Medium",
      category: "Electrical",
      subCategory: "Outlet",
      permissionToEnter: "No",
      description: "Power outlet not working near study desk.",
      status: "In Progress",
      technicianNotes: "Electrician assigned.",
      completed: "-"
    },
    {
      id: 10103,
      roomNumber: "C303",
      name: "Michael Lee",
      priority: "Low",
      category: "Pest Control",
      subCategory: "Roaches",
      permissionToEnter: "Yes",
      description: "Roach sightings near kitchen and bathroom.",
      status: "Resolved",
      technicianNotes: "Sprayed pesticide and sealed entry points.",
      completed: "4/14/2025"
    }
  ]);

  const [filter, setFilter] = useState("New");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState("");
  const [editedRequests, setEditedRequests] = useState({});
  const [pageMessage, setPageMessage] = useState(null); // Global message

  const handleFieldEdit = (id, field, value) => {
    setEditedRequests((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    const original = requests.find((req) => req.id === id);
    const edits = editedRequests[id] || {};
    const updated = { ...original, ...edits };
    const updatedDate = updated.status === "Resolved" ? new Date().toLocaleDateString() : "-";

    setPageMessage("Saving...");

    try {
      const response = await fetch(`/api/maintenance-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: updated.status,
          technicianNotes: updated.technicianNotes,
          completed: updatedDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, ...updated, completed: updatedDate } : req))
      );

      setEditedRequests((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });

      setPageMessage("Saved!");
      setTimeout(() => setPageMessage(null), 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setPageMessage("Error saving. Please try again.");
      setTimeout(() => setPageMessage(null), 3000);
    }
  };

  const filteredRequests = requests.filter((req) => req.status === filter);

  return (
    <div className="manage-maintenance-wrapper wider-table-wrapper">
      <div className="manage-maintenance-container wider wide-card">
        <div className="action-selector">
          {['New', 'In Progress', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`action-btn ${filter === status ? "active" : ""}`}
            >
              {status} Requests
            </button>
          ))}
        </div>

        <div className="form-section">
          {pageMessage && (
            <div className="page-message">
              {pageMessage}
            </div>
          )}

          <h2 className="form-title">{filter} Maintenance Requests</h2>
          <div className="table-responsive">
            <table className="custom-table full-width-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Name</th>
                  <th>Priority</th>
                  <th>Category</th>
                  <th>Sub-category</th>
                  <th>Permission</th>
                  <th>Description</th>
                  <th>Technician Notes</th>
                  <th>Status</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length ? (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.roomNumber}</td>
                      <td>{req.name}</td>
                      <td>{req.priority}</td>
                      <td>{req.category}</td>
                      <td>{req.subCategory}</td>
                      <td>{req.permissionToEnter}</td>
                      <td>{req.description}</td>
                      <td>
                        {editingNoteId === req.id ? (
                          <input
                            type="text"
                            className="note-input"
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            onBlur={() => {
                              handleFieldEdit(req.id, "technicianNotes", tempNote);
                              setEditingNoteId(null);
                            }}
                            autoFocus
                          />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ maxWidth: "160px", overflowWrap: "break-word" }}>
                              {editedRequests[req.id]?.technicianNotes || req.technicianNotes || "—"}
                            </span>
                            <button
                              className="icon-button"
                              onClick={() => {
                                setEditingNoteId(req.id);
                                setTempNote(editedRequests[req.id]?.technicianNotes ?? req.technicianNotes);
                              }}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          value={editedRequests[req.id]?.status || req.status}
                          onChange={(e) => handleFieldEdit(req.id, "status", e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="submit-btn small"
                          onClick={() => handleSave(req.id)}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center">No {filter.toLowerCase()} requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMaintenancePanel;
