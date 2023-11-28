import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UnsoldItems from "../components/UnsoldItems";
import SoldItems from "../components/SoldItems";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import PastItemsButton from "../../shared/components/FormElements/PastItemsButton";
import "./PastItems.css";

const PastItems = () => {
  const [soldItems, setSoldItems] = useState([]);
  const [unsoldItems, setUnsoldItems] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchSoldItems = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/getSoldItems/${userId}`
        );
        setSoldItems(responseData.soldItems);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSoldItems();
  }, [sendRequest, userId]);

  useEffect(() => {
    const fetchUnsoldItems = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/getunSoldItems/${userId}`
        );
        setUnsoldItems(responseData.unsoldItems);
      } catch (err) {}
    };
    fetchUnsoldItems();
  }, [sendRequest, userId]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && (
        <div className="past-items-container">
          <div className="sold-items">
            <h2>Sold Items</h2>

            <Card>
              <SoldItems soldItems={soldItems} />
            </Card>
          </div>
          <div className="unsold-items">
            
            <h2>Unsold Items</h2>
            <PastItemsButton></PastItemsButton>
            <Card>
              <UnsoldItems unsoldItems={unsoldItems} />
            </Card>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default PastItems;
