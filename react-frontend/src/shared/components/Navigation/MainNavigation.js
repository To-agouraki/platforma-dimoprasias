import React, { useState, useEffect, useContext,useMemo } from "react";
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

  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  console.log(userId);

 

  // Memoize the userSockets object to prevent it from changing on every render
  const userSockets = useMemo(() => {
    return {
      [userId]: null, // Initialize the socket ID to null
    };
  }, [userId]);

  console.log(userId);
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: {
        userId: userId,
      },
    });
        socket.emit("userConnected", { userId });
    socket.on("connect", () => {
      setIsConnected(true); // Set connection status to true when connected
    });

    socket.on("notification", (data) => {
      setMessage(data.message);
    });

    console.log(message);
    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [message,userSockets,userId]); // Empty dependency array ensures the effect runs once after the initial render

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
        <p>{message} .</p>
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
        <Button onClick={showNotificationModal}>
          <FontAwesomeIcon icon={faBell} size="xl" />{" "}
        </Button>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
