import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./UserActivityBarChart.css"; // Add your CSS file for the User Activity Bar Chart

const UserActivityBarChart = (props) => {
  const { isLoading, error } = useHttpClient();
  const [currentPage, setCurrentPage] = useState(1);

  const [userActivitiesData, setUserActivitiesData] = useState([]);

  console.log(userActivitiesData);

  useEffect(() => {
    if (props.userActivitiesData) {
      setUserActivitiesData(props.userActivitiesData);
    }
  }, [props.userActivitiesData]);

  const itemsPerPage = 10;



  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the users to display on the current page
  const usersOnPage = userActivitiesData.slice(startIndex, endIndex);

  // Handle pagination controls
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(userActivitiesData.length / itemsPerPage))
    );
  };

  return (
    <div className="userActivityBarChartContainer">
      <h2>User Activity Bar Chart</h2>
      {isLoading && <LoadingSpinner />}
      {error && <p>Error: {error.message}</p>}
      {userActivitiesData.length > 0 && (
        <div>
          <BarChart width={1300} height={400} data={usersOnPage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bids" fill="#8884d8" name="Number of Bids" />
            <Bar
              dataKey="createdPlaces"
              fill="#82ca9d"
              name="Number of Created Places"
            />
            <Bar dataKey="wonItems" fill="#ffc658" name="Number of Won Items" />
            <Bar
              dataKey="soldItems"
              fill="#FF5733"
              name="Number of Sold Items"
            />
            <Bar
              dataKey="unSoldItems"
              fill="#33FF57"
              name="Number of Unsold Items"
            />
            {/* Add more bars as needed */}
          </BarChart>
          <div className="pagination-controls">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={goToNextPage}
              disabled={
                currentPage ===
                Math.ceil(userActivitiesData.length / itemsPerPage)
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivityBarChart;
