import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import io from 'socket.io-client';

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Button from "../FormElements/Button";
import Backdrop from "../UIElements/Backdrop";
import "./MainNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Modal from "../UIElements/Modal";

const Notifications = (props) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);




  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      setIsConnected(true); // Set connection status to true when connected
    });

    socket.on('notification', (data) => {
      setMessage(data.message);
    });

    console.log(message);
    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [message]); // Empty dependency array ensures the effect runs once after the initial render

  if (!isConnected) {
    return <div>Connecting to the server...</div>;
  }



  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const showNotificationModal = () => {
    setShowConfirmModal(true);
  };

  return (
    <React.Fragment>
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
            
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter{message}  .
        </p>
      </Modal>
    </React.Fragment>
  );
};

export default Notifications;
