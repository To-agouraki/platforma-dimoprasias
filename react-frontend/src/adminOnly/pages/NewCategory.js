import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

const NewCategory = () => {
  const [formIsValid, setFormIsValid] = useState(false);
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Update formIsValid based on formState.isValid
    setFormIsValid(formState.isValid);
  }, [formState.isValid]);

  const categorySubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("image", formState.inputs.image.value);

      // console.log("FormData:");
      // for (var pair of formData.entries()) {
      //   console.log(pair[0] + ', ' + pair[1]);
      // }

      // // Log specific details about the image file
      // const imageFile = formData.get("image");
      // if (imageFile instanceof File) {
      //   console.log("Image File Details:");
      //   console.log("Name:", imageFile.name);
      //   console.log("Type:", imageFile.type);
      //   console.log("Size:", imageFile.size, "bytes");
      // } else {
      //   console.log("No image file found in the FormData.");
      // }

      await sendRequest(
        "http://localhost:5000/api/admin/createCategory",
        "POST",
        formData, 
      );
       navigate("/categories");
    } catch (error) {
      console.error("Error creating category:", error.message);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />
      <form className="place-form" onSubmit={categorySubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <ImageUpload center id="image" onInput={inputHandler} />
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />

        <br />
        <Button type="submit" disabled={!formIsValid}>
          Create Category
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewCategory;
