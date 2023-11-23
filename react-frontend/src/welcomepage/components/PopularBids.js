// PopularBids.js

import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./PopularBids.css"; // You can create a CSS file for styling

const PopularBids = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [popularItems, setPupolarItems] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/places/items/getPopularItems"
        );
        setPupolarItems(responseData.popularItems);
        console.log(responseData.popularItems);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNewArrivals();
  }, [sendRequest]);

  const calculateTimeLeft = (dateTime) => {
    const now = new Date();
    const endTime = new Date(dateTime);
    const timeDiff = endTime - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  return (
    <div className="popular-bids">
      <ErrorModal error={nError} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <h2>Popular Bids</h2>
      <div className="bid-list">
        {popularItems.map((item) => (
          <div className="bid-item" key={item._id}>
            <img src={`http://localhost:5000/${item.image}`} alt={item.title} />
            <div className="bid-details">
              <h2><strong>{item.title}</strong></h2>
              <div className="details-row">
                <p>Category: <strong>{item.category.name}</strong> </p>
              </div>
              <div className="details-row">
                <p>Highest Bid: ${item.highestBid}</p>
              </div>
              <div className="details-row">
                <p>Number of bidders: {item.bids.length}</p>
              </div>
              <div className="details-row-last">
                <p>
                  Time Left: {calculateTimeLeft(item.dateTime).days} days,{" "}
                  {calculateTimeLeft(item.dateTime).hours} hours
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularBids;
