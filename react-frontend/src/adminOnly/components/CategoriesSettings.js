import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import CategoryList from "./CategoryList";

const CategoriesSettings = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient(); //gia kapio logo liturga {} anti gia []
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
  
  console.log(categories);

  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && categories && <CategoryList items={categories} />}
    </React.Fragment>
  );
  
};

export default CategoriesSettings;
