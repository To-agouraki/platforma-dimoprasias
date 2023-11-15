import React from "react";
import PageCategories from "../components/PageCategories";
import NewArrivals from "../components/NewArrivals";
import "./WelcomePage.css";

const WelcomePage = () => {
  console.log("kasod");
  return (
    <div className="page-layout">
      <div className="category-row">
        <PageCategories />
      </div>
      <div className="newarrivals-row">
        <NewArrivals />
      </div>
    </div>
  );
};

export default WelcomePage;
