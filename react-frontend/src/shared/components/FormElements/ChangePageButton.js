import Button from "./Button";

import React, { useState } from "react";
const ChangePageButton = (props) => {
  const [changeLink, setChangeLink] = useState(true);

  const ChangeItemsLink = () => {
    setChangeLink(!changeLink)
  };

  console.log(props.state);
  return (
    <div className="containerRight">
      <div className="deactButton">
        {" "}
        {props.state ? (
          <Button className="link" to="/deactivatedItems" onClick={ChangeItemsLink}>
            Deactivated Items
          </Button>
        ) : (
          <Button className="link" to="/market" onClick={ChangeItemsLink}>
            Activated Items
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChangePageButton;
