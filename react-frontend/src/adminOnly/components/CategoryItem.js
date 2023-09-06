import React from "react";
import Card from "../../shared/components/UIElements/Card";
import { Link } from "react-router-dom";
import "./CategoryItem.css";

const CategoryItem = ({ name, description, id }) => {
  return (
    <li className="category-item">
      <Card>
        <div className="category-header">
          <h3>{name}</h3>
          {/* Add the "Update" button inside the header */}
          <Link to={`/categories/${id}`} className="update-button">
            Update
          </Link>
        </div>
        <p>{description}</p>
        {/* Add different styles based on conditions */}
        <div className={description ? "has-description" : "no-description"}>
          {description ? "" : "No description available"}
        </div>
      </Card>
    </li>
  );
};

export default CategoryItem;
