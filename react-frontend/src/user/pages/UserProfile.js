import React from "react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../shared/components/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import ErrorMessage from "../../shared/components/FormElements/ErrorMessage";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useNavigate } from "react-router-dom";

import "./Auth.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },

      password: {
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

  const authentSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        //fetch adds header if you use FormData api
        `http://localhost:5000/api/users/updateuser/${authObj.userId}`,
        "PATCH",
        formData
      );
      setErrorMessageShow(false);
      navigate("/");
    } catch (error) {
      setErrorMessageShow(true);
    }
  };

  const { isLoading, nError, sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const [errorMessageShow, setErrorMessageShow] = useState(false);
  const authObj = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/getuser/${authObj.userId}`
        );
        setLoadedUser(responseData.user);
        console.log(responseData.user);
        setFormData(
          {
            name: {
              value: responseData.user.name,
              isValid: true,
            },
            password: {
              value: responseData.user.password,
              isValid: true,
            },
            image: {
              value: responseData.user.image,
              isValid:  true,
            },
          },
          true
        );
      } catch (error) {}
    };
    fetchUser();
  }, [sendRequest, authObj.userId, setFormData]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  
  

  return (
    <React.Fragment>
      <Card className="authentication">
        {errorMessageShow && <ErrorMessage message={nError} />}
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && loadedUser && (
          <form onSubmit={authentSubmitHandler}>
            <h2>User Settings</h2>
            <ImageUpload center id="image" existingimage={loadedUser.image} onInput={inputHandler} />
            <Input
              id="name"
              element="input"
              label="Name"
              type="text"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter valid name"
              onInput={inputHandler}
              initialValue={loadedUser.name}
              initialValid={true}
            ></Input>

            <Input
              element="input"
              type="password"
              label="Password"
              id="password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter valid password"
              onInput={inputHandler}
              initialValue={loadedUser.password}
              initialValid={true}
            />
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE
            </Button>
          </form>
        )}
      </Card>
    </React.Fragment>
  );
};
export default UserProfile;
