import React, { useState, useEffect } from "react";
import CountdownTimer from "./CountDownTimer";

const CountdownPage = (props) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const handleDateTimeChange = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  useEffect(() => {
    if (selectedDateTime) {
      props.getDateTime(selectedDateTime);
    }
  }, [selectedDateTime, props]);

  return (
    <div>
      <h3>Countdown Timer</h3>
      <CountdownTimer onDateTimeChange={handleDateTimeChange} />
      <br />
      <p>
        Selected Date/Time:{" "}
        {selectedDateTime ? selectedDateTime.toString() : "None"}
      </p>
    </div>
  );
};

export default CountdownPage;
