import React, { useState, useEffect, useContext, useMemo } from "react";
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
import { useHttpClient } from "../../hooks/http-hook";

const MainNavigation = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false); // Add state for new notifications

  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage on component mount
    const storedMessages = localStorage.getItem("messages");
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const [isConnected, setIsConnected] = useState(false);
  const auth = useContext(AuthContext);
  const userId = auth.userId;

  useEffect(() => {
    if (auth.isLoggedIn) {
      const fetchNotifications = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/users/getusernotifications/${userId}`
          );

          // Extract relevant data from the response and format it
          const fetchedNotifications = responseData.notifications.map(
            (notification) => ({
              notificationId: notification._id,
              message: notification.message,
              timestamp: notification.timestamp,
            })
          );

          // Sort notifications by timestamp in descending order
          const sortedNotifications = fetchedNotifications.sort(
            (a, b) => a.timestamp - b.timestamp
          );

          // Update component state with sorted notifications
          setMessages(sortedNotifications);

          console.log(sortedNotifications);
          localStorage.setItem("messages", JSON.stringify(sortedNotifications));
          setHasNewNotification(true);
        } catch (error) {
          console.log(error);
        }
      };

      fetchNotifications();
    }
  }, [userId, auth.isLoggedIn, sendRequest]);

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
      // Extract message, timestamp, and notificationId from the received data
      const { message, timestamp, notificationId } = data;

      // Update messages state with new notification from socket
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { notificationId, message, timestamp },
        ];

        // Sort notifications by timestamp in descending order
        const sortedMessages = newMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Save sorted messages to localStorage
        localStorage.setItem("messages", JSON.stringify(sortedMessages));

        return sortedMessages;
      });

      setHasNewNotification(true);
    });

    // Load messages from localStorage on component mount
    const storedMessages = localStorage.getItem("messages");
    const initialMessages = storedMessages ? JSON.parse(storedMessages) : [];
    setMessages(initialMessages);
  }, [userId]);

  // Remove userSockets from the dependency array, it's not needed here

  const memoizedMessages = useMemo(() => messages, [messages]);

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

  const handleNotificationClick = (notificationId) => {
    console.log("Clicked on notification with id:", notificationId);
    // Add any additional logic you need here
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
          </React.Fragment>
        }
      >
        <div className="message-container">
          {memoizedMessages.length > 0 ? (
            memoizedMessages.map((message, index) => (
              <div
                key={index}
                className="message-notification"
                onClick={() => handleNotificationClick(message.notificationId)}
              >
                <p>{message.message}</p>
                <p>Date: {new Date(message.timestamp).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <div>No new notifications</div>
          )}
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
        {auth.isLoggedIn ? (
          hasNewNotification ? (
            <Button onClick={showNotificationModal}>
              <FontAwesomeIcon icon={faBell} shake size="xl" />{" "}
            </Button>
          ) : (
            <Button onClick={showNotificationModal}>
              <FontAwesomeIcon icon={faBell} size="xl" />{" "}
            </Button>
          )
        ) : null}

        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
