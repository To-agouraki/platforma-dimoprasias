import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ data, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  
  const handleSearch = (event) => {
    
    if (event.target.value === '') {
        onFilter(data);
    }
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm)
    );

    // Call the onFilter function with the filteredData
    onFilter(filteredData);
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
