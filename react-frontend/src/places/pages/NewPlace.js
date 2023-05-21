import React, { useContext, useEffect, useState } from "react";
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
import "./PlaceForm.css";
import { AuthContext } from "../../shared/components/context/auth-context";
import CountdownPage from "../../shared/components/FormElements/CountDownPage";

const NewPlace = () => {
  const [newVal, setNewVal] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  let datevar;
  const handleDateTimeChange = (dateTime) => {
    datevar = dateTime;
    setNewVal(!!dateTime);
  };
  const auth = useContext(AuthContext);
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setFormIsValid(formState.isValid && newVal);
  }, [formState.isValid, newVal]);

  const navigate = useNavigate();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          dateTime: datevar,
          creator: auth.userId,
        }),
        { "content-Type": "application/json" }
      );
      navigate("/");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
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
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <CountdownPage getDateTime={handleDateTimeChange} />
        <br />
        <Button type="submit" disabled={!formIsValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
