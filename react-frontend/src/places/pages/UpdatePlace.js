import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Select from "react-select";
import Card from "../../shared/components/UIElements/Card";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import "./PlaceForm.css";
// ... (import statements for Input, Button, Select, ErrorModal, LoadingSpinner, useForm, useHttpClient, and AuthContext)

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const placeId = useParams().placeId;
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setSelectedCategory({label: responseData.place.category, value: responseData.place.category});
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
            category: {
              value: responseData.place.category, // Assuming responseData.place.category is the category ID
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

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

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    inputHandler("category", selectedOption.value, true);
  };

  const updatePlaceHandler = async (event) => {
    event.preventDefault();
    try {
      // Extract other form data and update the place API endpoint accordingly
      // Update the category in the API request payload
      console.log(formState.inputs.title.value,formState.inputs.category.value);
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          category: formState.inputs.category.value, // Assuming formState.inputs.category.value is the category ID
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
  if (auth.isAdmin) {
        navigate("/market");
      } else {
        navigate("/" + auth.userId + "/places");
      }      // ...
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
	  {!isLoading && loadedPlace && (
      <form className="place-form" onSubmit={updatePlaceHandler}>
        <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
		  <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
        <div>
          <h3>Select a Category</h3>
          {/* Select component for categories */}
          <Select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={categories.map((category) => ({
              value: category.id, // Assuming category.id is the category ID
              label: category.name, // Assuming category.name is the category name
            }))}
            isSearchable={true}
            placeholder="Select a category"
          />
        </div>
        <br/>
        {/* Button to submit the form */}
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
	  )}
    </React.Fragment>
  );
};

export default UpdatePlace;
