import "./PlaceList.css";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useContext } from "react";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import React, { useState } from "react";
import Button from "../../shared/components/FormElements/Button";
const PlaceList = (props) => {
  let combinedData = [];

  if (Array.isArray(props.items) && props.items.length > 0) {
    //an exw bidding amounts pintono pano sto combiend an den exw to combined vasika piani jina pou inta na moun otu i allos
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

  const auth = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 2;

  const currentItems = combinedData.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const totalPages = Math.ceil(props.items.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log(`Current Page: ${pageNumber}`);
  };
  //console.log(props.items);
  //console.log(props.biddingamounts);

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

  if (typeof props.items === "undefined" && props.userId === auth.userId) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Items found .</h2>
          <Button to="/places/new">Share an Item</Button>
        </Card>
      </div>
    );
  }

  if (typeof props.items === "undefined") {
    return (
      <div className="place-list center">
        <Card>
          <h2>User has not added any item yet .</h2>
        </Card>
      </div>
    );
  }

  if (props.items.length === 0 && props.userId === auth.userId) {
    return (
      <div className="place-list center">
        {/*2 classes */}
        <Card>
          <h2>No Items found .</h2>
          <Button to="/places/new">Share an Item</Button>
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
    <React.Fragment>
      <ul className="place-list">
        {currentItems.map((item) => (
          <PlaceItem
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            description={item.description}
            category={item.category}
            creatorId={item.creator}
            dateTime={item.dateTime}
            onDelete={props.onDeletePlace}
            frombid={props.frombid}
            amount={item.amount}
            highestBid={item.highestBid}
            highestBidder={item.highestBidder}
          ></PlaceItem>
        ))}
      </ul>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <br></br>
    </React.Fragment>
  );
};

export default PlaceList;
