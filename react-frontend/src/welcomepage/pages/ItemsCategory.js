import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./ItemsCategory.css";

const ItemsCategory = () => {
  const { isLoading, sendRequest } = useHttpClient();
  const [items, setItems] = useState([]);
  const [pageTitle, setPageTitle] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // You can adjust the number of items per page
  const categoryId = useParams().categoryId;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/categoryItems/${categoryId}`
        );
        setItems(responseData.places);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [sendRequest, categoryId]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/admin/getCategory/${categoryId}`
        );
        setPageTitle(responseData.category.name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryName();
  }, [sendRequest, categoryId]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div>
      <h2 className="catPAgeTitle">{pageTitle}</h2>

      <div className="ICcontainer">
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {items.length === 0 && !isLoading && (
          <Card>
            <p>Oops, no items in this category yet!</p>
          </Card>
        )}

        {currentItems.length > 0 &&
          currentItems.map((item) => (
            <div className="ICcard" key={item.id}>
              <img
                src={`http://localhost:5000/${item.image}`}
                alt={item.title}
              />
              <div className="ICcard-content">
                <p>Name: </p>
                <div className="ICcard-title">{item.title}</div>
                <p>Description: </p>
                <div className="ICcard-description">{item.description}</div>
              </div>
            </div>
          ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ItemsCategory;
