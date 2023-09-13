import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    // Call the onFilter function with the search term
    onFilter(searchTerm);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
