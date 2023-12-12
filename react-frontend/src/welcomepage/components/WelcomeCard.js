import React from "react";
import "./WelcomeCard.css";

const WelcomeCard = () => {
  return (
    <div className="w3-row w3-container">
      <div className="center alilpad">
        <span className="w3-xlarge w3-bottombar w3-border-dark-grey w3-padding-16">What You Can expect </span>
      </div>
      <div className="w3-col l3 m6 w3-light-green w3-container w3-padding-16">
        <h3>Find or Create an item</h3>
        <p>Be the buyer or be the Seller</p>
      </div>

      <div className="w3-col l3 m6 w3-green w3-container w3-padding-16">
        <h3>Win the item you want</h3>
        <p>Place you bid and beat the the opposition</p>
      </div>

      <div className="w3-col l3 m6 w3-dark-green w3-container w3-padding-16">
        <h3>Sell your created items</h3>
        <p>Add the timer and wait for the bidders to win your item </p>
      </div>
    </div>
  );
};

export default WelcomeCard;
