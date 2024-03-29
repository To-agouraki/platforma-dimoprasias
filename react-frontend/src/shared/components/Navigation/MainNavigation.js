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
  const { sendRequest } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false); // Add state for new notifications

  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage on component mount
    const storedMessages = localStorage.getItem("messages");
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const auth = useContext(AuthContext);
  const userId = auth.userId;

  // console.log("User ID=>", userId);
  // console.log("is Admin=>", auth.isAdmin);
  // console.log("is user loggedin=>", auth.isLoggedIn);
  // console.log("local storage message=>", messages);
  // console.log("local storage =>", localStorage);

  useEffect(() => {
    if (auth.isLoggedIn && !auth.isAdmin) {
      setMessages([]);

      const fetchNotifications = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/users/getusernotifications/${userId}`
          );
          console.log("resposedata", responseData);

          let fetchedNotifications = [];

          if (
            responseData.notifications &&
            Array.isArray(responseData.notifications)
          ) {
            // Extract relevant data from the response and format it
            fetchedNotifications = responseData.notifications.map(
              (notification) => ({
                notificationId: notification._id,
                message: notification.message,
                timestamp: notification.timestamp,
              })
            );
          }

          // Sort notifications by timestamp in descending order
          const sortedNotifications = fetchedNotifications.sort(
            (a, b) => a.timestamp - b.timestamp
          );
          // Update component state with sorted notifications
          setMessages(sortedNotifications);

          console.log(sortedNotifications);
          localStorage.setItem("messages", JSON.stringify(sortedNotifications));
          if (sortedNotifications.length > 0) {
            setHasNewNotification(true);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchNotifications();
    }
  }, [userId, auth.isLoggedIn, sendRequest, auth.isAdmin]);

  useEffect(() => {
    if (userId) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: userId,
        },
      });

      socket.on("connect", () => {
        if (socket.handshake && socket.handshake.query) {
          console.log(
            "Connection established with query:",
            socket.handshake.query
          );
        }
        console.log("User connected with ID:", userId);
        socket.emit("userConnected", { userId: userId });
      });

      socket.on("notification", (data) => {
        const { message, timestamp, notificationId } = data;

        setMessages((prevMessages) => {
          const newMessages = [
            ...prevMessages,
            { notificationId, message, timestamp },
          ];

          const sortedMessages = newMessages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );

          localStorage.setItem("messages", JSON.stringify(sortedMessages));

          return sortedMessages;
        });

        setHasNewNotification(true);
      });

      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected`);
        // You may want to update your state or perform other cleanup actions here
      });

      return () => {
        socket.disconnect();
        console.log("Socket disconnected for user:", userId);
      };
    }
  }, [userId]);

  // Remove userSockets from the dependency array, it's not needed here

  const memoizedMessages = useMemo(() => messages, [messages]);

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

  const markAsReadHandler = async (event, notificationId) => {
    event.stopPropagation(); // Prevent the click event from reaching the parent div
    console.log(
      "Mark as Read clicked for notification with id:",
      notificationId
    );
    try {
      // Assuming sendRequest returns a Promise
      await sendRequest(
        `http://localhost:5000/api/users/updateNotification/${notificationId}`,
        "PATCH"
      );

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter(
          (message) => message.notificationId !== notificationId
        );

        // Save updated messages to local storage
        localStorage.setItem("messages", JSON.stringify(updatedMessages));

        return updatedMessages;
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
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
              Close
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
                <p dangerouslySetInnerHTML={{ __html: message.message }}></p>
                <p>Date: {new Date(message.timestamp).toLocaleString()}</p>
                <button
                  className="mark-as-read-button"
                  onClick={(event) =>
                    markAsReadHandler(event, message.notificationId)
                  }
                >
                  Mark as Read
                </button>
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
        {auth.isLoggedIn && !auth.isAdmin ? (
          hasNewNotification ? (
            <button className="NotifButton" onClick={showNotificationModal}>
              <FontAwesomeIcon icon={faBell} shake size="2xl" />{" "}
            </button>
          ) : (
            <button className="NotifButton" onClick={showNotificationModal}>
              <FontAwesomeIcon icon={faBell} size="2xl" />{" "}
            </button>
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
