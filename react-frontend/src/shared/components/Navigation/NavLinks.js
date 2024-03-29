import "./NavLinks.css";
import { NavLink } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../context/auth-context";
const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact='true'>
          {auth.isLoggedIn ? "DASHBOARD" : "HOME"}
        </NavLink>
      </li>

      {!auth.isAdmin && (
        <li>
          <NavLink to={`/market`}>MARKET</NavLink>
        </li>
      )}

      {auth.isAdmin && auth.isLoggedIn && (
        <li>
          <NavLink to={"/categories"}>CATEGORIES</NavLink>
        </li>
      )}

      {auth.isAdmin && auth.isLoggedIn && (
        <li>
          <NavLink to={`/users`}>USERS</NavLink>
        </li>
      )}

      {auth.isLoggedIn && !auth.isAdmin && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY ITEMS</NavLink>
        </li>
      )}

      {auth.isAdmin && (
        <li>
          <NavLink to={`/allitems/items`}>ALL ITEMS</NavLink>
        </li>
      )}

      {auth.isLoggedIn && !auth.isAdmin && (
        <li>
          <NavLink to={`/${auth.userId}/biddedItems`}>BIDS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && !auth.isAdmin && (
        <li>
          <NavLink to={"/user/profile"}>PROFILE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && !auth.isAdmin && (
        <li>
          <NavLink to="/places/new">NEW ITEM</NavLink>
        </li>
      )}
      {auth.isLoggedIn && !auth.isAdmin && (
        <li>
          <NavLink to={`/wonItems/${auth.userId}`}>WON ITEMS</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button className="logout-button " onClick={auth.logout}>
            Log Out
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
