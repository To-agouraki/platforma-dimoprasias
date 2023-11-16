import React from "react";
import PageCategories from "../components/PageCategories";
import NewArrivals from "../components/NewArrivals";
import WelcomeCard from "../components/WelcomeCard";
import "./WelcomePage.css";

const WelcomePage = () => {
  console.log("kasod");
  return (
    <div className="testia">
      <WelcomeCard></WelcomeCard>
      <br></br>
      <PageCategories></PageCategories>
      <br></br>
      <NewArrivals></NewArrivals>
      <br></br>
      <div class="banner">
        <a href="https://www.ebay.com/">
          <div
            class="banner-image"
          ></div>
          <div class="banner-content">
            <h2>Check all the items</h2>
            <p>Perfect combination: warrantied quality, low cost, high tech</p>
            <button>Browse iPhones</button>
          </div>
        </a>
      </div>
      <br></br>
    </div>
  );
};

export default WelcomePage;
