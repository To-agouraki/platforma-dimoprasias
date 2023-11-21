// PopularBids.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PopularBids.css"; // You can create a CSS file for styling

const PopularBids = () => {
  // Dummy data for testing
  const popularBids = [
    {
      id: "1",
      title: "Item 1",
      image: "/images/item1.jpg",
      category: "Category 1",
    },
    {
      id: "2",
      title: "Item 2",
      image: "/images/item2.jpg",
      category: "Category 2",
    },
    // Add more items as needed
  ];

  return (
    <div className="popular-bids">
      <h2>Popular Bids</h2>
      <div className="bid-list">
        {popularBids.map((item) => (
          <div className="bid-item" key={item.id}>
            <img src={`http://localhost:5000/${item.image}`} alt={item.title} />
            <div className="bid-details">
              <p>Name: {item.title}</p>
              <p>Category: {item.category}</p>
              <Link to={`/product/${item.id}`}>
                <button className="w3-button w3-light-grey w3-block">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularBids;
