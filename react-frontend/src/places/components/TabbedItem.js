// TabbedItem.js

import React from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";

import "./TabbedItem.css";

const TabbedItem = (props) => {
  return (
    <div className="tabbed-item-container">
      {props.isCollapsed ? (
        <Card className="tabbed-item">
          <div className="tabbed-item-left">
            <img
              className="tabbed-item-image"
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            ></img>
            <div className="tabbed-item-title">
              <h3>{props.title}</h3>
            </div>
          </div>
          {/* Additional content for the right side if needed */}
          <div className="tabbed-item-right">
            <Button onClick={props.onToggleCollapse}>
              {props.isCollapsed ? "Expand" : "Not collapsed"}
            </Button>
          </div>
        </Card>
      ) : (
        /* Content when not collapsed */
        <p>Not collapsed</p>
      )}
    </div>
  );
};

export default TabbedItem;
