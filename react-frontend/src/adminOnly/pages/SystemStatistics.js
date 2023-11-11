// components/AdminStatistics.js
import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./SystemStatistics.css";

const SystemStatistics = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/statistics"
        );
        setStatistics(responseData);
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
    </div>
  );
};

export default SystemStatistics;
