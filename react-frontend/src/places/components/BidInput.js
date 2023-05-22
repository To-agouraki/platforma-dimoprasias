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

  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log("input number", number);
   // console.log("items id=", props.itemId);
   // console.log("use id", auth.userId);
    try {
      await sendRequest(
        "http://localhost:5000/api/places/biditem",
        "POST",
        JSON.stringify({
          userId: auth.userId,
          itemId: props.itemId,
          amount: number,
        }),
        { "content-Type": "application/json" }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="form-control" onSubmit={handleSubmit}>
      <label>
        Enter you bidding amount:
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
