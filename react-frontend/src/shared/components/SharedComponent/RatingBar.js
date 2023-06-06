import React, { useState } from "react";

import "./RatingBar.css";

const RatingBar = () => {
  const [rating, setRating] = useState(0);

  const handleRatingClick = (value) => {
    setRating(value);
  };
  return (
    <div className="rating">
      <div className="rating-value">Rating: {rating}</div>
      <div className="stars">
        <span
          className={rating >= 1 ? "active" : ""}
          onClick={() => handleRatingClick(1)}
        >
          &#9733;
        </span>
        <span
          className={rating >= 2 ? "active" : ""}
          onClick={() => handleRatingClick(2)}
        >
          &#9733;
        </span>
        <span
          className={rating >= 3 ? "active" : ""}
          onClick={() => handleRatingClick(3)}
        >
          &#9733;
        </span>
        <span
          className={rating >= 4 ? "active" : ""}
          onClick={() => handleRatingClick(4)}
        >
          &#9733;
        </span>
        <span
          className={rating >= 5 ? "active" : ""}
          onClick={() => handleRatingClick(5)}
        >
          &#9733;
        </span>
      </div>
    </div>
  );
};

export default RatingBar;
