import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "../styles/Card.css"; // Make sure the CSS file is linked

const Card = ({ children, onClick, isSelected }) => {
  return (
    <div className={`card ${isSelected ? "selected" : ""}`} onClick={onClick}>
      {children}
    </div>
  );
};

// Add prop types validation
Card.propTypes = {
  children: PropTypes.node.isRequired,  // children can be any renderable content
  onClick: PropTypes.func,              // onClick should be a function
  isSelected: PropTypes.bool           // isSelected should be a boolean
};

export default Card;
