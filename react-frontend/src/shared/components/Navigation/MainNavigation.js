import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { AuthContext } from "../context/auth-context";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Button from "../FormElements/Button";
import Backdrop from "../UIElements/Backdrop";
import "./MainNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import NotificationsModal from "../Notification/NotificationsModal";

const MainNavigation = (props) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false); // Add state for new notifications

  const [messages, setMessages] = useState([]); // Array to store messages
  const [isConnected, setIsConnected] = useState(false);
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  console.log(userId);

  console.log(userId);
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: {
        userId: userId,
      },
    });

    socket.on("connect", () => {
      setIsConnected(true); // Set connection status to true when connected
      socket.emit("userConnected", { userId: userId }); // Emit userConnected event after connection
      console.log("id", userId);
    });

    socket.on("notification", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
      setHasNewNotification(true);
    });

    console.log(messages);
    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [messages, userId]); // Remove userSockets from the dependency array, it's not needed here
  // Empty dependency array ensures the effect runs once after the initial render

  if (!isConnected) {
    return <div>Connecting to the server...</div>;
  }

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const showNotificationModal = () => {
    setShowConfirmModal(true);
    setHasNewNotification(false);
  };

  return (
    <React.Fragment>
      <NotificationsModal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Notification"
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
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>
      </NotificationsModal>

      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Auction Platform</Link>
        </h1>
        {hasNewNotification ? (
          <Button onClick={showNotificationModal}>
            <FontAwesomeIcon icon={faBell} shake size="xl" />{" "}
          </Button>
        ) : (
          <Button onClick={showNotificationModal}>
            <FontAwesomeIcon icon={faBell} size="xl" />{" "}
          </Button>
        )}
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
