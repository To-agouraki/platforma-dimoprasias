// PageCategories.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";

const ItemsCategory = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [items, setItems] = useState([]);
  const categoryId = useParams().categoryId;
  console.log(categoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
            `http://localhost:5000/api/places/categoryItems/${categoryId}`
            );
        setItems(responseData.places);
        console.log(responseData.places);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [sendRequest, categoryId]);

  return <p>lol</p>;
};

export default ItemsCategory;
