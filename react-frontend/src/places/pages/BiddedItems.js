import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SearchBar from "../../shared/components/SharedComponent/SearchBar";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState(" ");
  const [loadedAmounts, setLoadedAmounts] = useState("");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [filteredData, setFilteredData] = useState([]); //serach bar

  const handleFilter = (filteredData) => {
    //sreearch bar
    setFilteredData(filteredData);
  };

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/getuserbids/${userId}`
        );
        console.log(responseData.items);

        const items = responseData.items;
        let place = [];
        let amount = [];

        items.forEach((item) => {
          place.push(item.place);
          amount.push(item.amount);
          //place = item.place to access them seperately
        });

        setLoadedPlaces(place);
        setFilteredData(place);
        setLoadedAmounts(amount);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

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
          <div className="search-container">
            <SearchBar data={loadedPlaces} onFilter={handleFilter} />
          </div>
          <PlaceList
            items={filteredData}
            biddingamounts={loadedAmounts}
            userId={userId}
            frombid={true}
            onDeletePlace={placeDeletedHandler}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
