import React from "react";
import { Link } from "react-router-dom";
import PageCategories from "../components/PageCategories";
import NewArrivals from "../components/NewArrivals";
import WelcomeCard from "../components/WelcomeCard";
import Slideshow from "../components/Slideshow";
import PopularBids from "../components/PopularBids";
import "./WelcomePage.css";

const WelcomePage = () => {
  return (
    <div className="testia">
      <Slideshow></Slideshow>
      <br></br>
      <WelcomeCard></WelcomeCard>
      <br></br>
      <PageCategories></PageCategories>
      <br></br>
      <NewArrivals></NewArrivals>
      <PopularBids></PopularBids>
      <br></br>
      <div className="banner">
        <Link to={`/market`}>
          <div className="banner-image"></div>
          <div className="banner-content">
            <h2>Check all the items</h2>
            <p>Perfect combination of all the user created products</p>
            <button>Browse All Items</button>
          </div>
        </Link>
      </div>
      <br></br>
    </div>
  );
};

export default WelcomePage;
