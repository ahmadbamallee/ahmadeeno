// src/components/PopupMessage.js
import React from 'react';


function PopupMessage({ message, type, onClose }) {
  return (
    <div className="popup-message-overlay">
      <div className={`popup-message ${type}`}>
        <p>{message}</p>
        <button onClick={onClose} className="close-button">&times;</button>
      </div>
    </div>
  );
}

export default PopupMessage;
