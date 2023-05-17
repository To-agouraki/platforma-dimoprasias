import React, { useState } from 'react';
import CountdownTimer from './CountDownTimer';

const CountdownPage = () => {
    const [selectedDateTime, setSelectedDateTime] = useState(null);

  const handleDateTimeChange = (dateTime) => {
    setSelectedDateTime(dateTime);
  };
  return (
    <div>
      <h3>Countdown Timer</h3>
      <CountdownTimer onDateTimeChange={handleDateTimeChange} />
      <br/>
      <p>Selected Date/Time: {selectedDateTime ? selectedDateTime.toString() : 'None'}</p>

      <p>or</p>

      <p>{selectedDateTime &&  selectedDateTime.toString()} </p>
    </div>
  );
};

export default CountdownPage;
