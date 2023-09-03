import React from 'react';
import './AdminDashboard.css';

const UserDashboard = () => {
  return (
    <div className="admin-dashboard">{/*pio pithano na grafi welcome :user*/}
      <h1>User Dashboard</h1>
      <div className="button-container">
        <button className="dashboard-button">Button 1</button>
        <button className="dashboard-button">Button 2</button>
      </div>
    </div>
  );
};

export default UserDashboard;