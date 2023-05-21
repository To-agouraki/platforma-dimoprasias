import React, { useState, useEffect } from "react";
import CountdownTimer from "./CountDownTimer";

const CountdownPage = (props) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
 //let inDateTime=props.initialDateTime;//valida meta etsi oste na me eni poio mikro pou tin simerini


  const handleDateTimeChange = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  useEffect(() => {
    if (selectedDateTime !== null) { // Check for null explicitly
      props.getDateTime(selectedDateTime);
    }
  }, [selectedDateTime, props]);

  return (
    <div>
      <h3>Countdown Timer</h3>
      <CountdownTimer 
        
        initialDateTime={props.initialDateTime} // Pass initialDateTime as string
        onDateTimeChange={handleDateTimeChange}
      />
      <br />
      {/* Additional content */}
    </div>
  );
};

export default CountdownPage;
