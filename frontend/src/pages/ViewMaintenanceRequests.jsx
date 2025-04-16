import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import "../styles/Maintenance.css";

const AdminMaintenancePanel = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("New");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState("");
  const [editedRequests, setEditedRequests] = useState({});
  const [pageMessage, setPageMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/maintenance-requests");
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load maintenance requests:", err);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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
      const response = await fetch(`http://localhost:8080/api/maintenance-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: updated.status,
          technicianNotes: updated.technicianNotes,
          completed: updatedDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      const savedRequest = await response.json();
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? savedRequest : req))
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
          {["New", "In Progress", "Resolved"].map((status) => (
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
          {pageMessage && <div className="page-message">{pageMessage}</div>}
          <h2 className="form-title">{filter} Maintenance Requests</h2>

          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
          ) : (
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
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.room_number}</td>
                        <td>{req.name}</td>
                        <td>{req.priority}</td>
                        <td>{req.category}</td>
                        <td>{req.sub_category}</td>
                        <td>{req.permission_to_enter}</td>
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
                                {editedRequests[req.id]?.technicianNotes ||
                                  req.technician_notes ||
                                  "—"}
                              </span>
                              <button
                                className="icon-button"
                                onClick={() => {
                                  setEditingNoteId(req.id);
                                  setTempNote(
                                    editedRequests[req.id]?.technicianNotes ??
                                      req.technician_notes
                                  );
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
                            onChange={(e) =>
                              handleFieldEdit(req.id, "status", e.target.value)
                            }
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
                      <td colSpan={10} className="text-center">
                        No {filter.toLowerCase()} requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMaintenancePanel;
