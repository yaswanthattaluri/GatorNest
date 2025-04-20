import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import "../styles/Maintenance.css";

const MaintenanceHistory = ({ requests }) => {
  return (
    <div className="maintenance-container">
      <h2 className="form-title">Maintenance Request History</h2>
      <Card>
        <div className="table-responsive">
          <table className="custom-table full-width-table">
            <thead>
              <tr>
                <th>Request #</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date Completed</th>
                <th className="tech-notes">Technician Notes</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req, index) => (
                  <tr key={index}>
                    <td>{req.id}</td>
                    <td>{req.category}</td>
                    <td>{req.description}</td>
                    <td>{req.status}</td>
                    <td>{req.completed}</td>
                    <td className="tech-notes" style={{ maxWidth: "200px", wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "normal" }}>
  {req.technician_notes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No maintenance requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

MaintenanceHistory.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      completed: PropTypes.string.isRequired,
      technician_notes: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MaintenanceHistory;
