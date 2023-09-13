import React from "react";

const CategoryFilter = ({ selectedCategory, categories, onCategoryFilter }) => {




  return (
    <ul>
      <li
        onClick={() => onCategoryFilter("")}
        className={selectedCategory === "" ? "active" : ""}
      >
        All
      </li>
      {categories.map((category) => (
        <li
          key={category.key}
          onClick={() => onCategoryFilter(category.name)}
          className={selectedCategory === category.name ? "active" : ""}
        >
          {category.name}
        </li>
      ))}
    </ul>
  );
};

export default CategoryFilter;
