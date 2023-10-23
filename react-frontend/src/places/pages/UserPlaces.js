  import React, { useState, useEffect } from "react";
  import { useParams } from "react-router-dom";

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
          </div >
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
