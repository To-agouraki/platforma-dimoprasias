//userPlaces  pale
import React, { useEffect, useState ,useContext} from "react";
//import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SearchBar from "../../shared/components/SharedComponent/SearchBar";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const ItemMarket = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [filteredData, setFilteredData] = useState([]); //serach bar

  const authObj = useContext(AuthContext);


  const handleFilter = (filteredData) => {
    //sreearch bar
    setFilteredData(filteredData);
  };

  const userId = authObj.userId;

 if(authObj.isLoggedIn){
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/market/${authObj.userId}`
        );
        setLoadedPlaces(responseData.places);
        setFilteredData(responseData.places);

        console.log(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);
 }else if(!authObj.isLoggedIn){
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/market/loggedout/general`
        );
        setLoadedPlaces(responseData.places);
        setFilteredData(responseData.places);

        console.log(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);
 }

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
            userId={userId}
            fromMarket={true}
            onDeletePlace={placeDeletedHandler}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default ItemMarket;
