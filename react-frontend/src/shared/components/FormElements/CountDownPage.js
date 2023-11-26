import React, { useState, useEffect } from "react";
import CountdownTimer from "./CountDownTimer";

const CountdownPage = (props) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  //const [onCountdownEnd, setOnCountdownEnd] = useState(null);
  //let inDateTime=props.initialDateTime;//valida meta etsi oste na me eni poio mikro pou tin simerini

  const handleDateTimeChange = (dateTime) => {
    //change in time
    setSelectedDateTime(dateTime);
  };

  const handleCountdownEnd = (value) => {
    // Check if props.getFromCount is a function before calling it
    if (typeof props.getFromCount === "function") {
      props.getFromCount(value);
    }
  };

  useEffect(() => {
    if (selectedDateTime !== null) {
      // Check for null explicitly
      props.getDateTime(selectedDateTime);
    }
  }, [selectedDateTime, props]);

  return (
    <div>
      <h3>Time remaining:</h3>
      <CountdownTimer
        initialDateTime={props.initialDateTime} // Pass initialDateTime as string
        onDateTimeChange={handleDateTimeChange}
        onCountdownEnd={handleCountdownEnd}
      />
      <br />
      {/* Additional content */}
    </div>
  );
};

export default CountdownPage;
