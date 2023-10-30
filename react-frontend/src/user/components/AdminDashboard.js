import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your server URL

const AdminDashboard = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen for 'notification' event from the server
    socket.on('notification', (data) => {
      setMessage(data.message); // Update the state with the received message
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };  
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <div>
      <h1>Socket.io Test</h1>
      <p>Message from server: {message}</p>
    </div>
  );
};

export default AdminDashboard;
