import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SearchBar from "../../shared/components/SharedComponent/SearchBar";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState("");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Maintain selected category

  const handleFilter = (filteredData) => {
    setFilteredData(filteredData);
  };

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
        setFilteredData(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setFilteredData((prevFilteredData) =>
      prevFilteredData.filter((place) => place.id !== deletedPlaceId)
    );
  };

  const categories = ["Category1", "Category2", "Category3"]; // Replace with your actual category data

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <div>
          <div className="category-list">
            <span
              className={`category ${selectedCategory === "" ? "active" : ""}`}
              onClick={() => setSelectedCategory("")}
            >
              All
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className={`category ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </span>
            ))}
          </div>
          <div className="search-container">
            <SearchBar data={loadedPlaces} onFilter={handleFilter} />
          </div>
          <PlaceList
            items={filteredData}
            userId={userId}
            onDeletePlace={placeDeletedHandler}
            selectedCategory={selectedCategory} // Pass selectedCategory as prop
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
