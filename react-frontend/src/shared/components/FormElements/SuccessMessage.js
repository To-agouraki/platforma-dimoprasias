import React, { useState } from 'react';
import "./SuccessMessage.css";

function SuccessMessage(props) {
  const [showSuccess, setShowSuccess] = useState(true);

  const handleClose = () => {
    setShowSuccess(false);
  };

  return (
    <>
      {showSuccess && (
        <div className="success-message">
          <div className="message">{props.message}</div>
          <div className="close-button" onClick={handleClose}>
            x
          </div>
        </div>
      )}
    </>
  );
}

export default SuccessMessage;
