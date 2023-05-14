import "./NavLinks.css";
import { NavLink } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../context/auth-context";
const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
       {auth.isLoggedIn && (
        <li>
          <NavLink to={'/user/profile'}>PROFILE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">NEW PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (<li><button onClick={auth.logout}>LogOut</button></li>)}
    </ul>
  );
};

export default NavLinks;
