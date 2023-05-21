import React, { useState, useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./BidInput.css";

const BidInput = (props) => {
  const auth = useContext(AuthContext);

  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");

  const isNumber = (str) => {
    const numberRegex = /^-?\d+(\.\d+)?$/;
    return numberRegex.test(str);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;

    if (isNumber(inputValue)) {
      setNumber(inputValue);
    } else if (inputValue === "") {
      setNumber("");
    } else {
      console.log("not a number");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("input number", number);
    console.log("items id=", props.itemId);
    console.log("use id", auth.userId);
    // sendRequest('/validate-number', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ number }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const { isValid } = data;
    //     if (isValid) {
    //       // Perform actions with the submitted positive number
    //       console.log(number);
    //     } else {
    //       setError('Invalid number. Please enter a positive value.');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Validation error:', error);
    //   });
  };

  return (
    <form className="form-control" onSubmit={handleSubmit}>
      <label>
        Enter a number:
        <input
          className="bid"
          type="number"
          value={number}
          onChange={handleChange}
        />
      </label>
      <Button type="submit">Submit</Button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default BidInput;
