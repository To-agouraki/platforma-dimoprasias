import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SearchBar from "../../shared/components/SharedComponent/SearchBar";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./UserPlaces.css"; // Import your CSS file for styling

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState(""); // Only loadedPlaces is used
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Category filter state
  const [categoriess, setCategoriess] = useState([]);

console.log(filteredData);


  // Fetcgin categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/categories"
        );
        setCategoriess(responseData.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [sendRequest]);

  const options = categoriess.map((category) => ({
    //dame en ta categories
    name: category.name,
    key: category._id,
  }));

  const handleFilter = (filteredData) => {
    setFilteredData(filteredData);
  };

  const userId = useParams().userId;

  useEffect(() => {
    //Fetch Items
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
    //Delete Handler
    setFilteredData((prevFilteredData) =>
      prevFilteredData.filter((place) => place.id !== deletedPlaceId)
    );
  };

  // Function to handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "") {
      setFilteredData(loadedPlaces);

      // Show all places if no category selected
    } else {
      // Filter places based on the selected category
      const filteredPlaces = loadedPlaces.filter(
        (place) => place.category === category
      );
      setFilteredData(filteredPlaces);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="user-places">
        <div className="sidebar">
          <h3>Filter by Category</h3>
          <ul>
            <li
              onClick={() => handleCategoryFilter("")}
              className={selectedCategory === "" ? "active" : ""}
            >
              All
            </li>
            {options.map(
              (
                option //Category Filter
              ) => (
                <li
                  key={option.key}
                  onClick={() => handleCategoryFilter(option.name)}
                  className={selectedCategory === option.name ? "active" : ""}
                >
                  {option.name}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="places">
          {isLoading && (
            <div className="center">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && (
            <div>
              <div className="search-container">
                <SearchBar data={filteredData} onFilter={handleFilter} />
              </div>
              <PlaceList
                items={filteredData}
                userId={userId}
                onDeletePlace={placeDeletedHandler}
              />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserPlaces;
