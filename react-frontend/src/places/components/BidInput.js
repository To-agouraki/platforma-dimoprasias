import React, { useState, useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorMessage from "../../shared/components/FormElements/ErrorMessage";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./BidInput.css";

const BidInput = (props) => {
  const [errorMessageShow, setErrorMessageShow] = useState(false);

  const auth = useContext(AuthContext);

  const { isLoading, nError, sendRequest } = useHttpClient();
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
      setError("no a number");
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
      const newBidAmount = number;
      props.onBidAmountChange(newBidAmount);
      setErrorMessageShow(false);
      props.onError(errorMessageShow);
    } catch (error) {
      setErrorMessageShow(true);
      props.onError(errorMessageShow);
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
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {nError && <ErrorMessage message={nError} />}
    </form>
  );
};

export default BidInput;
