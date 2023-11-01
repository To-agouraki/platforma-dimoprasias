import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";

import "./PlaceItem.css";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import BidInput from "./BidInput";
import Modal from "../../shared/components/UIElements/Modal";
//import RatingBar from "../../shared/components/SharedComponent/RatingBar";
import CountdownPage from "../../shared/components/FormElements/CountDownPage";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import TabbedItem from "./TabbedItem";

const PlaceItem = (props) => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [theDateTime, setTheDateTime] = useState("");
  const [bidAmount, setBidAmount] = useState(props.amount); // when the bid amount chancges
  const [highestbidAmount, setHighestBidAmount] = useState(props.highestBid);
  const [counterExpire, setCounterExpire] = useState(false);
  const [highestBidder, setHighestBidder] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleView = () => {
    setIsCollapsed((view) => !view);
  };

  useEffect(() => {
    // Check if highestBidder prop exists and is truthy
    if (props.highestBidder) {
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

  if (props.highestBid === 0) {
    sentence = (
      <h3>No one won the item, the item will remain with its creator</h3>
    );
  } else {
    sentence = (
      <h3>
        The item was won by the user {highestBidder} for the amount of{" "}
        {props.highestBid}
      </h3>
    );
  }

  const handleCounterExpire = () => {
    setCounterExpire(true);
  };

  useEffect(() => {
    // Update bid amount when props.amount changes
    setBidAmount(props.amount);
    setHighestBidAmount(props.highestBid);
  }, [props.amount, props.highestBid]);

  const handleBidAmountChange = (newAmount) => {
    setBidAmount(newAmount);
    setHighestBidAmount(newAmount);
  };

  //console.log(props.amount);
  const auth = useContext(AuthContext);

  //  let initialDateTimeString = "2023-06-02T18:43:00.000Z";//props.dateTime;
  // let initialDateTime = new Date(initialDateTimeString);
  let initialDateTime;
  useEffect(() => {
    if (props.dateTime) {
      const originalDateTimeString = props.dateTime;
      const convertedDateTimeString = originalDateTimeString.replace(
        "+00:00",
        "Z"
      );
      initialDateTime = convertedDateTimeString;
      setTheDateTime(initialDateTime);
    }
  }, [props.dateTime, initialDateTime, theDateTime]);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // const openMapHandler = () => {
  // setShowMap(true);
  //};

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // const confirmDeleteHandler = async () => {
  //   setShowConfirmModal(false);
  //   try {
  //     await sendRequest(
  //       `http://localhost:5000/api/places/${props.id}`,
  //       "DELETE",
  //       null,
  //       { Authorization: "Bearer " + auth.token }
  //     );
  //     props.onDelete(props.id);
  //   } catch (err) {}
  // };

  const confirmDeactivateHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/deactivate/${props.id}`,
        "PATCH",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  const handleCategoryClick = (category) => {
    // You can implement your filtering logic here.
    // For example, you can call a function passed from the parent component
    // to handle the filtering based on the clicked category.
    // This function could update the state to display only items with the selected category.
    // Assuming you have a function called filterItemsByCategory in your parent component:
    // filterItemsByCategory(category);
  };

  console.log(props.activationState);

  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        headerClass="dummyclass"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <h2>Container info </h2>
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            {/* <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button> */}
            {props.activationState ? (
              <Button danger onClick={confirmDeactivateHandler}>
                Deactivate
              </Button>
            ) : (
              <Button onClick={confirmDeactivateHandler}>Activate</Button>
            )}
          </React.Fragment>
        }
      >
        {props.activationState ? (
          <p>
            Do you want to proceed and delete this place? Please note that it
            can't be undone thereafter.
          </p>
        ) : (
          <p>
            Do you want to Activate this item? After you activate this item it
            wil be visible.
          </p>
        )}
      </Modal>
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
              {counterExpire ? (
                <h3 className="red-text">
                  The Bid is closed, you cannot bid anymore.
                </h3>
              ) : (
                <h3 className="green-text">
                  You may proceed with bid process.
                </h3>
              )}
              {theDateTime ? (
                <CountdownPage
                  className="center"
                  getFromCount={handleCounterExpire}
                  initialDateTime={theDateTime}
                />
              ) : (
                <p>loading....</p>
              )}
              {props.category && (
                <p className="place-item__category">
                  Category:{" "}
                  <button
                    className="category-button"
                    onClick={() => handleCategoryClick(props.category)}
                  >
                    {props.category}
                  </button>
                </p>
              )}
            </div>

            <div className="place-item__actions">
              {/*<Button inverse onClick={openMapHandler}>
                Additional info
              </Button>*/}
              {/* inverse class from button css*/}
              {!counterExpire && auth.userId === props.creatorId && (
                <Button to={`/places/${props.id}`}>Edit</Button>
              )}
              {!counterExpire && auth.isAdmin && (
                <Button to={`/places/${props.id}`}>Edit</Button>
              )}

              {/* {auth.userId === props.creatorId && ( //for item creator
                <Button danger onClick={showDeleteWarningHandler}>
                  Delete
                </Button>
              )} */}
              {auth.isLoggedIn && props.activationState !== undefined ? (
                props.activationState ? (
                  <Button danger onClick={showDeleteWarningHandler}>
                    Deactivate
                  </Button>
                ) : (
                  <Button inverse onClick={showDeleteWarningHandler}>
                    Activate
                  </Button>
                )
              ) : null}

              {props.amount && <h4>The amount you have bid is {bidAmount}</h4>}
              {<h3>Highest Bid: {highestbidAmount}</h3>}

              {counterExpire && sentence}

              {!counterExpire &&
                auth.userId !== props.creatorId &&
                auth.isLoggedIn &&
                !auth.isAdmin && (
                  <BidInput
                    itemId={props.id}
                    onBidAmountChange={handleBidAmountChange}
                  />
                )}
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
        <TabbedItem
          key={props.id}
          id={props.id}
          image={props.image}
          title={props.title}
          description={props.description}
          category={props.category}
          creatorId={props.creatorId}
          dateTime={props.dateTime}
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

export default PlaceItem;
