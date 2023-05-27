import React, { useState, useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorMessage from "../../shared/components/FormElements/ErrorMessage";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./BidInput.css";

const BidInput = (props) => {
  const [errorMessageShow, setErrorMessageShow] = useState(false);
  const [empty, setEmpty] = useState(true);

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
      setErrorMessageShow(false);
      setEmpty(false);
    } else if (inputValue === "") {
      setNumber("");
      setEmpty(true);
      setError("cannot bid with empty field");
    } else {
      setError("no a number");
      setEmpty(false);//to deactivate button
      setErrorMessageShow(true);
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
    } catch (error) {
      setErrorMessageShow(true);
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
      <Button type="submit" disabled={empty}>Submit</Button>
      {isLoading && <LoadingSpinner />}
      {errorMessageShow && error && <ErrorMessage message={error} />}
      {errorMessageShow && nError && <ErrorMessage message={nError} />}
    </form>
  );
};

export default BidInput;
