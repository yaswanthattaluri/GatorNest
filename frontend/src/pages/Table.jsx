import React from "react";
import PropTypes from "prop-types";

const Table = ({ columns, data }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((col, index) => (
            <th key={index} className="p-3 border border-gray-400">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((room, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="p-3 border">{room.roomNumber}</td>
              <td className="p-3 border">{room.dormNumber}</td>
              <td className="p-3 border">{room.studentsEnrolled}</td>
              <td className="p-3 border">{room.sharedRoomsAvailable}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center p-4">No rooms available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      roomNumber: PropTypes.string,
      dormNumber: PropTypes.string,
      studentsEnrolled: PropTypes.number,
      sharedRoomsAvailable: PropTypes.number,
    })
  ).isRequired,
};

export default Table;
