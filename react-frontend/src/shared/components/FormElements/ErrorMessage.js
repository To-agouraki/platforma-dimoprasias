import React, { useState } from 'react';
import "./ErrorMessage.css";
function ErrorMessage(props) {
  const [showError, setShowError] = useState(true);

  const handleClose = () => {
    setShowError(false);
  };

  return (
    <>
      {showError && (
        <div className="error-message">
          <div className="message">{props.message}</div>
          <div className="close-button" onClick={handleClose}>
            x
          </div>
        </div>
      )}
    </>
  );
}

export default ErrorMessage;