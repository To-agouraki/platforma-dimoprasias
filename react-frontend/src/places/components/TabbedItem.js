// TabbedItem.js

import React, { useState} from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import PlaceItem from "./PlaceItem";

import "./TabbedItem.css";

const TabbedItem = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleView = () => {
    setIsCollapsed((view) => !view);
  };


  return (
    <div className="tabbed-item-container">
      {isCollapsed ? (
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
            <Button onClick={toggleView}>
              {props.isCollapsed ? "Expand" : "Not collapsed"}
            </Button>
          </div>
        </Card>
      ) : (

        <PlaceItem
        key={props.id}
        id={props.id}
        image={props.image}
        title={props.title}
        description={props.description}
        category={props.category}
        creatorId={props.creator}
        dateTime={props.dateTime}
        onDelete={props.onDelete}
        frombid={props.frombid}
        amount={props.amount}
        highestBid={props.highestBid}
        highestBidder={props.highestBidder}
       // onToggleCollapse={() => toggleItemCollapse(item.id)}
        isCollapsed={props.isCollapsed}
        />
      )}
    </div>
  );
};

export default TabbedItem;
