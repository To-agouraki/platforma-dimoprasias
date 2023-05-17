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
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import CountdownPage from "../../shared/components/FormElements/CountDownPage";
import "./Auth.css";

const Auth = () => {
  const authObj = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  //const [nError, setNError] = useState();

  const { isLoading, nError, sendRequest } = useHttpClient();

  const [errorMessageShow, setErrorMessageShow] = useState(false);
  const [formState, inputHandler, setFormData] = useForm(
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

    if (isLoginMode) {
      try {
        const responeData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        setErrorMessageShow(false);

        authObj.login(responeData.user.id);
      } catch (err) {
        setErrorMessageShow(true);
      }
    } else {
      try {
        const responeData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setErrorMessageShow(false);

        authObj.login(responeData.user.id);
      } catch (err) {
        setErrorMessageShow(true);
      }
    }
  };
  //////////////////////////////////////////////////////
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prev) => !prev);
  };

  return (
    <Card className="authentication">
      {isLoading && <LoadingSpinner asOverlay />}
      {errorMessageShow && <ErrorMessage message={nError} />}
      <h2>{isLoginMode ? "Log in" : "Sign up"}</h2>
      <hr />
      <form onSubmit={authentSubmitHandler}>
        {!isLoginMode && (
          <Input
            id="name"
            element="input"
            label="Name"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter valid name"
            onInput={inputHandler}
          ></Input>
        )}
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
      <Button inverse onClick={switchModeHandler}>
        {isLoginMode ? "Change to Sign Up" : "Change to Log in "}
      </Button>
      <CountdownPage/>
    </Card>
    
  );
};

export default Auth;
