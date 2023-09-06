import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";

const CategoriesSettings = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient(); //gia kapio logo liturga {} anti gia []
  const [categories, setCategories] = useState([]);
  //localhost:5000/api/admin/categories
  http: useEffect(() => {
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
};

export default CategoriesSettings;
