// PageCategories.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./PageCategories.css";

const PageCategories = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/categories"
        );
        setCategories(responseData.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [sendRequest]);

  return (
    <div className="upper-centered-content">
      <ErrorModal error={nError} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <h2>Explore Categories</h2>
      <div className="pcategory-list">
        {categories.map((category) => (
          <div className="pcategory-item-wrapper" key={category._id}>
            <Link to={`/category/${category._id}`}>
              <div className="pcategory-item">
                <img
                  src={`http://localhost:5000/${category.image}`}
                  alt={category.name}
                />
                <p className="link-text">{category.name}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageCategories;
