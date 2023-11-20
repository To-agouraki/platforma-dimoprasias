// Slideshow.js

import React, { useState, useEffect } from 'react';
import './SlideShow.css';

const Slideshow = () => {
  const messages = [
    'Welcome to the Auction Platform.',
    'Explore a range of products.',
    'Find the perfect item for you.',
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? messages.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === messages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 5000);

    return () => clearInterval(interval);
  });

  return (
    <div className="slideshow-container">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mySlides ${index === currentSlide ? 'active' : ''}`}
        >
          <div className="Slidemessage-container">
            <div className="Slidemessage">{message}</div>
          </div>
        </div>
      ))}
      <div className="button2-container">
        <span className="prev" onClick={goToPreviousSlide}>
          &#10094;
        </span>
      </div>
      <div className="button1-container">
        <span className="next" onClick={goToNextSlide}>
          &#10095;
        </span>
      </div>
      <div className="dot-container">
        {messages.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
