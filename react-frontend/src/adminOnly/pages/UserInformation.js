import React, { useEffect, useState } from "react";
import ErrorMessage from "../../shared/components/FormElements/ErrorMessage";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useParams } from "react-router-dom";

import "../../user/pages/Auth.css";

const UserInformation = () => {
  const id = useParams().userId;
  const { isLoading, nError, sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const [errorMessageShow, setErrorMessageShow] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/getuser/${id}`
        );
        setErrorMessageShow(false);
        setLoadedUser(responseData.user);
        console.log(responseData.user);
      } catch (error) {
        setErrorMessageShow(true);
      }
    };
    fetchUser();
  }, [sendRequest, id]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Card className="authentication">
        {errorMessageShow && <ErrorMessage message={nError} />}
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && loadedUser && (
          <div>
            <h2>User Information</h2>
            <img
              src={`http://localhost:5000/${loadedUser.image}`}
              alt={loadedUser.name}
              style={{ width: "350px", height: "100%" }}
            />{" "}
            <div className="userstats">{/* it in systemstatstics.css*/}
            <p>
              <strong>Name:</strong> {loadedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {loadedUser.email}
            </p>
            <p>
              <strong>Bids Placed: </strong> {loadedUser.bids.length}
            </p>
            <p>
              <strong>Item created: </strong> {loadedUser.places.length}
            </p>
            </div>
            {/* Add other user details here */}
          </div>
        )}
      </Card>
    </React.Fragment>
  );
};

export default UserInformation;
