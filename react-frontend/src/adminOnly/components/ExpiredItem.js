import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";

import "../../places/components/PlaceItem.css";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
//import RatingBar from "../../shared/components/SharedComponent/RatingBar";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ExpiredTabbed from "./ExpiredTabbed";

const ExpiredItem = (props) => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const highestbidAmount = props.highestBid;
  const [highestBidder, setHighestBidder] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [creator, setCreator] = useState("");

  console.log(props);

  const toggleView = () => {
    setIsCollapsed((view) => !view);
  };

  useEffect(() => {
    // Check if highestBidder prop exists and is truthy
    if (props.highestBidder) {
      console.log("the useEffect with the mount thingy");
      let isMounted = true; // Track if the component is mounted

      const fetchUserData = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/users/getuser/${props.highestBidder}`
          );

          if (isMounted) {
            setHighestBidder(responseData.user.name);
          }
        } catch (err) {
          // Handle errors appropriately
        }
      };
      fetchUserData();
      // Cleanup function
      return () => {
        isMounted = false; // Component is unmounted, cancel async operations if still pending
      };
    }
  }, [sendRequest, props.highestBidder]);

  useEffect(() => {
    // Check if highestBidder prop exists and is truthy

    let isMounted = true; // Track if the component is mounted

    const fetchUserData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/getuser/${props.creatorId}`
        );

        if (isMounted) {
          setCreator(responseData.user.name);
        }
      } catch (err) {
        // Handle errors appropriately
      }
    };
    fetchUserData();
    // Cleanup function
    return () => {
      isMounted = false; // Component is unmounted, cancel async operations if still pending
    };
  }, [sendRequest, props.creatorId]);

  useEffect(() => {
    // Check if highestBidder prop exists and is truthy
    if (props.highestBidder) {
      console.log("the useEffect with the mount thingy");
      let isMounted = true; // Track if the component is mounted

      const fetchUserData = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/users/getuser/${props.highestBidder}`
          );

          if (isMounted) {
            setHighestBidder(responseData.user.name);
          }
        } catch (err) {
          // Handle errors appropriately
        }
      };
      fetchUserData();
      // Cleanup function
      return () => {
        isMounted = false; // Component is unmounted, cancel async operations if still pending
      };
    }
  }, [sendRequest, props.highestBidder]);

  let sentence;

  if (highestbidAmount === 0) {
    sentence = (
      <h3>No one won the item, the item will remain with its creator</h3>
    );
  } else {
    sentence = (
      <h3>
        The item was won by the user {highestBidder} for the amount of{" "}
        {highestbidAmount}
      </h3>
    );
  }

  //console.log(props.amount);

  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />
      {!isCollapsed ? (
        <li className="place-item">
          {/* item ikona me koumpia kai description */}
          <Card className="place-item__content">
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="place-item__image">
              <img
                src={`http://localhost:5000/${props.image}`}
                alt={props.title}
              ></img>
            </div>

            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
              <h3>Creator: {creator}</h3>

              <h3 className="red-text">The Bid is closed.</h3>

              {props.category && (
                <p className="place-item__category">
                  Category:{" "}
                  <button className="category-button">{props.category}</button>
                </p>
              )}
            </div>

            <div className="place-item__actions">
              {<h3>Highest Bid: {highestbidAmount}</h3>}

              <h3>{sentence}</h3>

              <Button onClick={toggleView}>
                {isCollapsed ? (
                  <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
                ) : (
                  <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
                )}
              </Button>
            </div>

            {/*<RatingBar />*/}
          </Card>
        </li>
      ) : (
        <ExpiredTabbed
          key={props.id}
          id={props.id}
          image={props.image}
          title={props.title}
          description={props.description}
          category={props.category}
          creatorId={props.creatorId}
          dateTime={props.dateTime}
          fromMarket={props.fromMarket}
          onDelete={props.onDelete}
          frombid={props.frombid}
          amount={props.amount}
          highestBid={props.highestBid}
          highestBidder={props.highestBidder}
          activationState={props.activationState}
          // onToggleCollapse={() => toggleItemCollapse(item.id)}
          isCollapsed={props.isCollapsed}
        />
      )}
    </React.Fragment>
  );
};

export default ExpiredItem;
