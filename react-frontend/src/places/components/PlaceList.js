import "./PlaceList.css";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useContext, useState, useEffect } from "react";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import React from "react";
import Button from "../../shared/components/FormElements/Button";
import TabbedItem from "./TabbedItem";
import ChangePageButton from "../../shared/components/FormElements/ChangePageButton";
import PastItemsButton from "../../shared/components/FormElements/PastItemsButton";

const PlaceList = (props) => {
  const [tabbedView, setTabbedView] = useState(false);
  const [usersPerPage, setUsersPerPage] = useState(3);
  const auth = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    // Update combinedData with isCollapsed property and amount if biddingamounts exist
    const updatedCombinedData = props.items.map((place, index) => ({
      ...place,
      isCollapsed: true, // Initially, all items are collapsed
      amount: Array.isArray(props.biddingamounts)
        ? props.biddingamounts[index]
        : null,
    }));
    setCombinedData(updatedCombinedData);
  }, [props.items, props.biddingamounts]);

  //console.log(combinedData);

  const toggleTabbedView = () => {
    setTabbedView(true);
  };

  const toggleNormalView = () => {
    setTabbedView(false);
  };

  const handleUsersPerPageChange = (event) => {
    const newValue = parseInt(event.target.value, 10); // Parse the selected value as an integer
    setUsersPerPage(newValue);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleItemCollapse = (itemId) => {
    const updatedCombinedData = combinedData.map((item) =>
      item.id === itemId ? { ...item, isCollapsed: !item.isCollapsed } : item
    );
    setCombinedData(updatedCombinedData);
  };

  if (props.frombid && props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Bids found</h2>
        </Card>
      </div>
    );
  }
  if (props.fromDeactivated && props.items.length === 0) {
    return (
      <React.Fragment>
        <ChangePageButton state={props.deactState}></ChangePageButton>
        <div className="place-list center">
          <Card>
            <h2>No deactivated item found.</h2>
          </Card>
        </div>
      </React.Fragment>
    );
  }

  if (props.fromExpired && props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Expired Items</h2>
        </Card>
      </div>
    );
  }

  if (props.fromMarket && props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>Counld not find the item you are looking for.</h2>
        </Card>
      </div>
    );
  }

  if (
    typeof props.items === "undefined" &&
    props.userId === auth.userId &&
    !auth.isAdmin
  ) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Items found.</h2>
          <Button to="/places/new">Share an Item</Button>
        </Card>
      </div>
    );
  }

  if (typeof props.items === "undefined") {
    return (
      <div className="place-list center">
        <Card>
          <h2>User has not added any item yet.</h2>
        </Card>
      </div>
    );
  }

  if (auth.isAdmin && props.items.length === 0) {
    return (
      <React.Fragment>
        <div className="place-list center">
          <Card>
            <h2>No Items Found.</h2>
          </Card>
        </div>
      </React.Fragment>
    );
  }

  if (
    props.items.length === 0 &&
    props.userId === auth.userId &&
    !auth.isAdmin
  ) {
    return (
      <React.Fragment>
        <PastItemsButton
          state={props.deactState}
          userId={auth.userId}
        ></PastItemsButton>
        <div className="place-list center">
          <Card>
            <h2>No Items found.</h2>
            <Button to="/places/new">Share an Item</Button>
          </Card>
        </div>
      </React.Fragment>
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

  const currentItems = combinedData.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(props.items.length / usersPerPage);

  return (
    <React.Fragment>
      <div className="view-toggle-buttons">
        <button onClick={toggleTabbedView}>Tabbed View</button>
        <button onClick={toggleNormalView}>Normal View</button>
      </div>

      {!props.fromMarket &&
        !props.frombid &&
        auth.isAdmin && !props.fromUserPlace &&
        !props.fromExpired && (
          <ChangePageButton state={props.deactState}></ChangePageButton>
        )}

      {!props.fromMarket &&
        !props.frombid &&
        !auth.isAdmin &&
        !props.fromExpired &&
        auth.isLoggedIn && (
          <PastItemsButton
            state={props.deactState}
            userId={auth.userId}
          ></PastItemsButton>
        )}

      <div className="items-per-page">
        <label htmlFor="itemsPerPage">Items per page:</label>
        <select
          id="itemsPerPage"
          value={usersPerPage}
          onChange={handleUsersPerPageChange}
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="7">7</option>
          {/* Add more options as needed */}
        </select>
      </div>

      <ul className="place-list">
        {currentItems.map((item) =>
          tabbedView ? (
            <TabbedItem
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
              fromMarket={props.fromMarket}
              highestBid={item.highestBid}
              highestBidder={item.highestBidder}
              activationState={item.activationState}
              onToggleCollapse={() => toggleItemCollapse(item.id)}
              isCollapsed={item.isCollapsed}
            />
          ) : (
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
              fromMarket={props.fromMarket}
              highestBid={item.highestBid}
              highestBidder={item.highestBidder}
              activationState={item.activationState}
              onToggleCollapse={() => toggleItemCollapse(item.id)}
              isCollapsed={item.isCollapsed}
            />
          )
        )}
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
    </React.Fragment>
  );
};

export default PlaceList;
