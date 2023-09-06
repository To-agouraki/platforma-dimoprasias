import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
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
      const requestBody = {
        name: formState.inputs.name.value,
        description: formState.inputs.description.value,
      };

      await sendRequest(
        "http://localhost:5000/api/admin/createCategory",
        "POST",
        JSON.stringify(requestBody),
        {
          "Content-Type": "application/json",
        }
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
