// WonItems.js
import React from "react";
import Card from "../../shared/components/UIElements/Card";
import "./WonItem.css"; // Import your CSS file
import Button from "../../shared/components/FormElements/Button";

const WonItem = (props) => {
  const wonItems = props.wonItems;

  if (!wonItems || wonItems.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2 className="noitemmeesage">No won items available.</h2>
          <h3>Find the items in the market,place your bid and win the item you want</h3>
          <Button to="/market">Go To Market.</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="won-items-container">
      {wonItems.map((item) => (
        <div className="won-item" key={item._id}>
          <img src={`http://localhost:5000/${item.image}`} alt={item.title} />
          <h3>{item.title}</h3>
          <p>
            Description: <strong>{item.description}</strong>
          </p>
          <p>
            Category: <strong>{item.category.name}</strong>
          </p>
          <p>Highest Bid: ${item.highestBid}</p>
          {/* Add more information as needed */}
        </div>
      ))}
    </div>
  );
};

export default WonItem;
