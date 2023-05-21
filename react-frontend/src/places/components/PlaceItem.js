import React, { useState, useContext, useEffect } from "react";

import "./PlaceItem.css";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import BidInput from "./BidInput";
import Modal from "../../shared/components/UIElements/Modal";
import CountdownPage from "../../shared/components/FormElements/CountDownPage";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [theDateTime, setTheDateTime] = useState("");

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

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE"
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
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
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <li className="place-item">
        {/* item ikona me koumpia kai description */}
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={props.image} alt={props.title}></img>
          </div>

          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>

            {theDateTime ? (
              <CountdownPage className="center" initialDateTime={theDateTime} />
            ) : (
              <p>loading....</p>
            )}
          </div>

          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              View On Map
            </Button>
            {/* inverse class from button css*/}
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                Delete
              </Button>
            )}
            {auth.userId !== props.creatorId && auth.isLoggedIn && (<BidInput itemId={props.id}/>)}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
