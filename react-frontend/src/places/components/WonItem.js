import React, { useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import "./WonItem.css"; // Import your CSS file

const ITEMS_PER_PAGE = 5; // Adjust as needed

const WonItem = (props) => {
  const { wonItems } = props;
  const [currentPage, setCurrentPage] = useState(1);

  if (!wonItems || wonItems.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2 className="noitemmeesage">No won items available.</h2>
          <h3>Find the items in the market, place your bid, and win the item you want</h3>
          <Button to="/market">Go To Market.</Button>
        </Card>
      </div>
    );
  }

  // Calculate pagination boundaries
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = currentPage * ITEMS_PER_PAGE;

  // Get the items for the current page
  const currentItems = wonItems.slice(startIndex, endIndex);

  return (
    <div className="won-items-container">
      {currentItems.map((item) => (
        <div className="won-item" key={item._id}>
          <img src={`http://localhost:5000/${item.image}`} alt={item.title} />
          <h3>{item.title}</h3>
          <p>
            Description: <strong>{item.description}</strong>
          </p>
          <p>
            Category: <strong>{item.category.name}</strong>
          </p>
          <p>Highest Bid: €{item.highestBid}</p>
          {/* Add more information as needed */}
        </div>
      ))}
      {wonItems.length > ITEMS_PER_PAGE && (
        <div className="pagination-container">
          {Array.from({ length: Math.ceil(wonItems.length / ITEMS_PER_PAGE) }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WonItem;
