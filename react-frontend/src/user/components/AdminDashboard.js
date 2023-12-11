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
  const itemDescr =
    "With his button you can check all the items where you edit and delete but not create them since the admin does not create items";
   const Deacti =
    "With his button you can check all the Deactivated items where you can again reactivated them";
    const expired =
    "With his button you can check all the items that are expired and see which were sold or unsold";
    const stats =
    "With his button you can check all the Statistics of the system";


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
          <Link
            to="/allitems/items"
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(itemDescr)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            All Items
          </Link>
          <Link
            to="/deactivatedItems"
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(Deacti)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Deactivated Items
          </Link>
          <Link
            to="/allitems/expired"
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(expired)}
            onMouseLeave={() => setHoveredButton(null)}
          >
          Expired Items
          </Link>
          <Link
            to="/systemStatistics"
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(stats)}
            onMouseLeave={() => setHoveredButton(null)}
          >
          Statistics
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
