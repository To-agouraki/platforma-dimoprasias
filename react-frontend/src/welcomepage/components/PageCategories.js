import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
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
        console.log(responseData.categories);
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
      <div className="category-list">
        {categories.map((category) => (
          <Link to={`/category/${category._id}`} key={category._id}>
            <div className="category-item">
              <img
                src={`http://localhost:5000/${category.image}`}
                alt={category.name}
              />
              <p>{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
  
  
};

export default PageCategories;
