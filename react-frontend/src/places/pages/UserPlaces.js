import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/components/context/auth-context";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SearchBar from "../../shared/components/SharedComponent/SearchBar";
import CategoryFilter from "../../shared/components/SharedComponent/CategoryFilter";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./UserPlaces.css";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/categories"
        );
        setCategories(responseData.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [sendRequest]);

  const options = categories.map((category) => ({
    name: category.name,
    key: category._id,
  }));

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchFilter = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const userId = useParams().userId;
  console.log(auth.isAdmin, "admin");

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        let url;
        if (!auth.isAdmin) {
          url = `http://localhost:5000/api/places/user/${userId}`;
          // Fetch all items for admin
        } else {
          url = `http://localhost:5000/api/places/user/allitems/${userId}`; // Fetch user-specific items
        }
        const responseData = await sendRequest(url);
        setLoadedPlaces(responseData.places);
        setFilteredData(responseData.places);
      } catch (err) {
        // Handle errors
      }
    };
    fetchUserPlaces();
  }, [sendRequest, userId, auth.isAdmin]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setFilteredData((prevFilteredData) =>
      prevFilteredData.filter((place) => place.id !== deletedPlaceId)
    );
  };

  useEffect(() => {
    let filteredPlaces = loadedPlaces;

    if (selectedCategory) {
      filteredPlaces = filteredPlaces.filter(
        (place) => place.category === selectedCategory
      );
    }

    if (searchTerm) {
      filteredPlaces = filteredPlaces.filter((place) =>
        place.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filteredPlaces);
  }, [selectedCategory, searchTerm, loadedPlaces]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="user-places">
        <div className="sidebar">
          <h3>Filter by Category</h3>
          <CategoryFilter
            categories={options}
            selectedCategory={selectedCategory}
            onCategoryFilter={handleCategoryFilter}
          />
        </div>
        <div className="content">
          <div className="places">
            {isLoading && (
              <div className="center">
                <LoadingSpinner />
              </div>
            )}
            {!isLoading && (
              <div>
                <div className="search-container">
                  <SearchBar onFilter={handleSearchFilter} />
                </div>
                <PlaceList
                  items={filteredData}
                  userId={userId}
                  onDeletePlace={placeDeletedHandler}
                  deactState={true}
                  fromUserPlace={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserPlaces;
