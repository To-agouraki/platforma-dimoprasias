import React, { useState } from "react";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // State to track which button is being hovered
  const [hoveredButton, setHoveredButton] = useState(null);

  const categoriesDescr =
    "With this button you can go to the categories page where you can Create ,Delete ,Update and Edit categories for the items the user can create. ";
  const usersDescr =
    "With this button you can see the users of system (apart from the admin) were you can edit them or the items they created. ";

  console.log(hoveredButton);
  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="content-container">
        <div className="button-container">
          <Link
            to="/categories"
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(categoriesDescr)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Categories
          </Link>
          <Link
            to="/users"
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(usersDescr)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Users
          </Link>
          {/* Add similar event handlers for other buttons */}
        </div>
      </div>
      {hoveredButton && (
        <div className="description-box">
          <p className="description-paragraph">{hoveredButton}</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
