import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="button-container">
      <Link to="/categories" className="dashboard-button">Button 1</Link>
        <button className="dashboard-button">Button 2</button>
        <button className="dashboard-button">Button 3</button>
        <button className="dashboard-button">Button 4</button>
      </div>
    </div>
  );
};

export default AdminDashboard;