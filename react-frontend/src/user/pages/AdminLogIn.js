import React, { useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorMessage from "../../shared/components/FormElements/ErrorMessage";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  
} from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import "./Auth.css";

const AdminLogIn = () => {
  const authObj = useContext(AuthContext);
  // const [isLoading, setIsLoading] = useState(false);
  //const [nError, setNError] = useState();

  const { isLoading, nError, sendRequest } = useHttpClient();

  const [errorMessageShow, setErrorMessageShow] = useState(false);
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  /////////////////////////////////////////////
  const authentSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responeData = await sendRequest(
        "http://localhost:5000/api/admin/login",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        { "Content-Type": "application/json" }
      );
      setErrorMessageShow(false);

      authObj.isAdminLogIn(responeData.userId, responeData.token);
    } catch (err) {
      setErrorMessageShow(true);
    }
  };

  //////////////////////////////////////////////////////


  return (
    <Card className="authentication">
      {isLoading && <LoadingSpinner asOverlay />}
      {errorMessageShow && <ErrorMessage message={nError} />}
      <h2>Administrator Login</h2>
      <hr />
      <form onSubmit={authentSubmitHandler}>
        <Input
          element="input"
          type="email"
          label="E-mail"
          id="email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter valid email"
          onInput={inputHandler}
        />

        <Input
          element="input"
          type="password"
          label="Password"
          id="password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter valid password"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Submit
        </Button>
      </form>
      <Button inverse to="/auth">
        Back
      </Button>
    </Card>
  );
};

export default AdminLogIn;
