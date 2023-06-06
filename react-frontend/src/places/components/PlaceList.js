import "./PlaceList.css";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useContext } from "react";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import React from "react";
import Button from "../../shared/components/FormElements/Button";
const PlaceList = (props) => {
  const auth = useContext(AuthContext);

  //console.log(props.items);
  //console.log(props.biddingamounts);

  let combinedData = [];

  if (Array.isArray(props.items) && props.items.length > 0) {
    if (
      Array.isArray(props.biddingamounts) &&
      props.biddingamounts.length > 0
    ) {
      const amounts = props.biddingamounts;

      combinedData = props.items.map((place, index) => ({
        ...place,
        amount: amounts[index],
      }));
    } else {
      combinedData = props.items;
    }
  }

  //console.log(combinedData);

  if (props.frombid) {
    if (props.items.length === 0) {
      return (
        <div className="place-list center">
          {/*2 classes */}
          <Card>
            <h2>No Bids found</h2>
          </Card>
        </div>
      );
    }
  }

  if (props.fromMarket) {
    if (props.items.length === 0) {
      return (
        <div className="place-list center">
          {/*2 classes */}
          <Card>
            <h2>
              No Items found in the Market, wait for users to add items for bid
            </h2>
          </Card>
        </div>
      );
    }
  }

  if (props.items.length === 0 && props.userId === auth.userId) {
    return (
      <div className="place-list center">
        {/*2 classes */}
        <Card>
          <h2>No Places found .</h2>
          <Button to="/places/new">Share a place</Button>
        </Card>
      </div>
    );
  } else if (props.items.length === 0 && props.userId !== auth.userId) {
    return (
      <div className="place-list center">
        <Card>
          <h2>User has not added any item yet .</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {combinedData.map(
        (
          item //from db
        ) => (
          <PlaceItem
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            description={item.description}
            address={item.address}
            creatorId={item.creator}
            dateTime={item.dateTime}
            onDelete={props.onDeletePlace}
            frombid={props.frombid}
            amount={item.amount}
            highestBid={item.highestBid}
            highestBidder={item.highestBidder}
          ></PlaceItem>
        )
      )}
    </ul>
  );
};

export default PlaceList;
