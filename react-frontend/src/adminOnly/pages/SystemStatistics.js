// components/AdminStatistics.js
import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Charts from "../components/Charts";
import TimeSeriesLineChart from "../components/TimeSeriesLineChart";

import "./SystemStatistics.css";

const SystemStatistics = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [statistics, setStatistics] = useState({});
  const [categoryCounters, setCategoryCounters] = useState({});
  const [placeCreationDate, setPlaceCreationDate] = useState([]);

  const dummyPlacesData = [
    { id: 1, name: "Place 1", creationDate: "2023-01-01T10:00:00" },
    { id: 2, name: "Place 2", creationDate: "2023-01-01T11:30:00" },
    { id: 3, name: "Place 3", creationDate: "2023-01-02T08:45:00" },
    { id: 4, name: "Place 4", creationDate: "2024-01-02T14:20:00" },
    { id: 5, name: "Place 5", creationDate: "2023-01-03T09:10:00" },
    { id: 6, name: "Place 6", creationDate: "2023-01-03T15:45:00" },
    { id: 51, name: "Place 5", creationDate: "2023-01-03T09:10:00" },
    { id: 61, name: "Place 6", creationDate: "2023-01-03T15:45:00" },
    { id: 7, name: "Place 7", creationDate: "2023-01-04T12:30:00" },
    { id: 8, name: "Place 8", creationDate: "2023-01-04T18:15:00" },
    { id: 9, name: "Place 9", creationDate: "2023-01-05T07:20:00" },
    { id: 61, name: "Place 6", creationDate: "2023-01-03T15:45:00" },
    { id: 7, name: "Place 7", creationDate: "2023-01-04T12:30:00" },
    { id: 8, name: "Place 8", creationDate: "2023-01-04T18:15:00" },
    { id: 9, name: "Place 9", creationDate: "2023-01-05T07:20:00" },
    { id: 10, name: "Place 10", creationDate: "2023-01-05T13:50:00" },
    { id: 11, name: "Place 11", creationDate: "2023-01-06T11:05:00" },
    { id: 12, name: "Place 12", creationDate: "2023-01-06T16:40:00" },
    { id: 13, name: "Place 13", creationDate: "2023-01-06T16:40:01" },
    // Add more places with different creation dates
  ];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/statistics"
        );
        setStatistics(responseData);
        setCategoryCounters(responseData.CategoryItemsCount);
        setPlaceCreationDate(responseData.placesCreationDate);
      } catch (error) {
        console.log(error); // Handle error
      }
    };

    fetchStatistics();
  }, [sendRequest]);

  return (
    <div className="admin-statistics-container">
      <h2>Admin Statistics</h2>
      {isLoading && <LoadingSpinner />}
      {error && <p>Error: {error.message}</p>}
      {Object.keys(statistics).length > 0 && (
        <div className="statistics-grid">
          <div className="statistic-item">
            <h3>Total Items</h3>
            <p>{statistics.totalItems}</p>
          </div>
          <div className="statistic-item">
            <h3>Activated Items</h3>
            <p>{statistics.activatedItems}</p>
          </div>
          <div className="statistic-item">
            <h3>Deactivated Items</h3>
            <p>{statistics.deactivatedItems}</p>
          </div>
          <div className="statistic-item">
            <h3>Expired Items</h3>
            <p>{statistics.expiredItems}</p>
          </div>
          <div className="statistic-item">
            <h3>Non-Expired Items</h3>
            <p>{statistics.nonExpiredItems}</p>
          </div>
          <div className="statistic-item">
            <h3>Users Registed</h3>
            <p>{statistics.totalUsers}</p>
          </div>
          <div className="statistic-item">
            <h3>Sellers</h3>
            <p>{statistics.usersWithPlaces}</p>
          </div>
          <div className="statistic-item">
            <h3>Buyers</h3>
            <p>{statistics.usersWithBids}</p>
          </div>
          <div className="statistic-item">
            <h3>Categories</h3>
            <p>{statistics.totalCategories}</p>
          </div>
          {/* Add more statistics as needed */}
        </div>
      )}
      <Charts categoryCounters={categoryCounters}></Charts>
      <h3>Line Chart</h3>

      <br></br>
      <TimeSeriesLineChart placesData={placeCreationDate} />
    </div>
  );
};

export default SystemStatistics;
