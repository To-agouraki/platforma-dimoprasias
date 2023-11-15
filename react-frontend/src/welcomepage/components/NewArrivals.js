// NewArrivals.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./NewArrivals.css";

const NewArrivals = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/places/newarrivals/newitems"
        );
        setNewArrivals(responseData.places);
        console.log(responseData.places);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [sendRequest]);

  return (
    <div className="newarrivals-list">
        <ErrorModal error={nError} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <h2>New Arrivals</h2>
      {newArrivals.map((item) => (
        <Link to={`/product/${item.id}`} key={item.id}>
          <div className="newarrivals-item">
            <img src={`http://localhost:5000/${item.image}`} alt={item.title} />
            <p>{item.title}</p>
            <p>{item.category}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NewArrivals;
