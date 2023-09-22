import React from "react";
import Card from "../../shared/components/UIElements/Card";
import "./AdminDashboard.css";

const UserDashboard = () => {
  return (
    <div className="centered-content">
      <div className="admin-dashboard">
        {/*pio pithano na grafi welcome :user*/}
        <Card>
          <h1>User Dashboard</h1>
          <h3>Welcome User</h3>
          <div className="button-container">
            <button className="dashboard-button">Market</button>
            <button className="dashboard-button">My Items</button>
            <button className="dashboard-button">Profile</button>
            <button className="dashboard-button">New Item</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
