import "./PlaceList.css";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import React from "react";
import Button from "../../shared/components/FormElements/Button";
const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        {/*2 classes */}
        <Card>
          <h2>No Places found bud</h2>
          <Button to="/places/new">Share a place</Button>
        </Card>
      </div>
    );
  } else {
    return (
      <ul className="place-list">
        {props.items.map((place) => (//from db
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            dateTime={place.dateTime}
            onDelete={props.onDeletePlace}
          ></PlaceItem>
        ))}
      </ul>
    );
  }
};

export default PlaceList;
