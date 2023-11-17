// NewArrivals.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import "./NewArrivals.css";

const NewArrivals = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/places/newarrivals/newitems"
        );
        setNewArrivals(responseData.places);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNewArrivals();
  }, [sendRequest]);

  return (
    <div className="featured-products">
      <ErrorModal error={nError} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Card>
      <h2>New Arrivals</h2>
      <div className="product-list">
        {newArrivals.map((item) => (
          <Link to={`/product/${item.id}`} key={item.id}>
            <div className="product-item">
              <img src={`http://localhost:5000/${item.image}`} alt={item.title} />
              <p>Name: {item.title}</p>
              <p>category: {item.category}</p>
            </div>
          </Link>
        ))}
      </div>
      </Card>
    </div>
  );
};

export default NewArrivals;
