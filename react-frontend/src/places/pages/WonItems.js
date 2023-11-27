// WonItems.js

import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import WonItemsList from "./WonItemsList"; // Adjust the import path as needed
import { AuthContext } from "../../shared/components/context/auth-context";

const WonItems = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [wonItems, setWonItems] = useState([]);

  useEffect(() => {
    const fetchWonItems = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/wonitems/${"123"}`
        );
        setWonItems(responseData.wonItems);
      } catch (error) {
        // Handle errors
      }
    };

    fetchWonItems();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="won-items">
        <h2>Won Items</h2>
        <WonItemsList wonItems={wonItems} />
      </div>
    </React.Fragment>
  );
};

export default WonItems;
