import React, { useState } from "react";
import CategoryItem from "./CategoryItem";
import { Link } from "react-router-dom";

const CategoryList = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 2;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentCategories = props.items.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(props.items.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (currentCategories.length === 0) {
    return (
      <div className="center">
        <h2>No categories found.</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="center categories-title">Categories</h2>
      <div className="center">
        <Link to="/categories/new" className="center new-category-button">
          New Category
        </Link>
      </div>

      <ul className="users-list">
        {currentCategories.map((categories) => (
          <CategoryItem
            key={categories.id}
            id={categories.id}
            name={categories.name}
            description={categories.description}
          />
        ))}
      </ul>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <br></br>
    </div>
  );
};

export default CategoryList;
