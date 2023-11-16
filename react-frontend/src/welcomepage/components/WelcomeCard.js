import React from "react";
import Card from "../../shared/components/UIElements/Card";
import "./WelcomeCard.css";

const WelcomeCard = () => {
  return (
    <div className="w3-row w3-container">
      <div className="center alilpad">
        <span className="w3-xlarge w3-bottombar w3-border-dark-grey w3-padding-16">What You Can expect </span>
      </div>
      <div className="w3-col l3 m6 w3-light-green w3-container w3-padding-16">
        <h3>Find or Create an item</h3>
        <p>Place your Bid for that item</p>
      </div>

      <div className="w3-col l3 m6 w3-green w3-container w3-padding-16">
        <h3>Win the item you want</h3>
        <p>Additional description goes here...</p>
      </div>

      <div className="w3-col l3 m6 w3-dark-green w3-container w3-padding-16">
        <h3>Another Section</h3>
        <p>Additional description goes here...</p>
      </div>
    </div>
  );
};

export default WelcomeCard;
