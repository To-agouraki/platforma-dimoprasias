import Button from "./Button";
import { useNavigate } from "react-router-dom";

import React, { useState } from "react";
const PastItemsButton = (props) => {
  const [changeLink, setChangeLink] = useState(true);

  const ChangeItemsLink = () => {
    setChangeLink(!changeLink);
  };
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  console.log(props.state);
  return (
    <div className="containerRight">
      <div className="deactButton">
        {" "}
        {props.state ? (
          <Button
            className="link"
            to={`/pastItems/${props.userId}`}
            onClick={ChangeItemsLink}
          >
            Past Items
          </Button>
        ) : (
          <Button className="link" onClick={handleGoBack}>
            Active Items
          </Button>
        )}
      </div>
    </div>
  );
};

export default PastItemsButton;
