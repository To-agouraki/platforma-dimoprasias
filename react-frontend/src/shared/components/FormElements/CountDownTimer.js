import React, { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";

const CountdownTimer = ({
  initialDateTime,
  onDateTimeChange,
  onCountdownEnd,
}) => {
  const [targetDateTime, setTargetDateTime] = useState(
    initialDateTime ? new Date(initialDateTime) : null
  );
  const [remainingTime, setRemainingTime] = useState("");

  const [errorMessage, setErrorMessage] = useState("");



  useEffect(() => {
    let intervalId;

    const updateTime = () => {
      const now = new Date().getTime();
      const distance = targetDateTime.getTime() - now;

      if (distance <= 0) {
        // Countdown reached zero, stop the timer
        clearInterval(intervalId);
        setRemainingTime("Time has expired!");
        if (onCountdownEnd) {
          onCountdownEnd(true); // Pass true to indicate countdown end
        }
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setRemainingTime(
          `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
        );
      }
    };

    if (targetDateTime) {
      intervalId = setInterval(updateTime, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [targetDateTime]);

  const handleDateTimeChange = (event) => {
    const selectedDateTime = new Date(event.target.value);
    const today = new Date();

    if (selectedDateTime > today) {
      setTargetDateTime(selectedDateTime);
      if (onDateTimeChange) {
        onDateTimeChange(selectedDateTime);
      }
    } else {
      setErrorMessage(
        "Please select a date and time later than the current date and time."
      );
    }
  };

  return (
    <div>
      {initialDateTime ? (
        <div>{remainingTime}</div>
      ) : (
        <>
          <input
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            onChange={handleDateTimeChange} 
          />
          {remainingTime && <div>{remainingTime}</div>}
          <br></br>
          {errorMessage && <ErrorMessage message={errorMessage}></ErrorMessage>}
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
