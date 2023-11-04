import React, { useState, useContext } from "react";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/components/context/auth-context";


const UserDashboard = () => {
  const auth = useContext(AuthContext);

  const [hoveredButton, setHoveredButton] = useState(null);

  const marketDescr =
    "With this button you can go to the Market where you can browse the items created by the other user ,then you can bid and when the time runs out chekc if you won the item ";
  const myItemsDescr =
    "With this button you can see the item you created and also edit them but only if the time doesnt run out. ";

    const bidsDescr ="With this button you can check how the items you have bidded are going , see if another user has bid a bigger amount than you.";
    const profileDescr ="With this button you can see your profie and change you profile picture to something of your liking other the standar the system gives you.";
    const newItemDescr ="With thus button you can create an item of your own and the other users of the app can bid to win it after the tune you set runs out";

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="content-container">
        <div className="button-container">
          <Link
            to="/market"
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(marketDescr)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Market
          </Link>
          <Link
            to={`/${auth.userId}/places`}
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(myItemsDescr)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            My Items
          </Link>
          <Link
            to={`/${auth.userId}/biddedItems`}
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(bidsDescr)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Bids
          </Link>
          <Link
            to={"/user/profile"}
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(profileDescr)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Profile
          </Link>
          <Link
            to="/places/new"
            className="dashboard-button"
            onMouseEnter={() => setHoveredButton(newItemDescr)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            New Item
          </Link>
        </div>
      </div>
      {hoveredButton && (
        <div className="description-box">
          <p className="description-paragraph">{hoveredButton}</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
