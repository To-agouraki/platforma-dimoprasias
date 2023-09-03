import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";

const CategoriesSettings = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient(); //gia kapio logo liturga {} anti gia []
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/categories"
        );
        setCategories(responseData.users);

      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [sendRequest]);

  console.log(categories);

};

export default CategoriesSettings;
