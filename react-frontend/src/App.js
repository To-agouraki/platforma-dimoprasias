import React, { useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import UserProfile from "./user/pages/UserProfile";
import BiddedItems from "./places/pages/BiddedItems";
import ItemMarket from "./places/pages/ItemMarket";
import { AuthContext } from "./shared/components/context/auth-context";

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const logIn = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //an den piaso dimiourgoo neo
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logOut = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logOut, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logOut, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() //an en pio megali pou tin torasini sirno nea
    ) {
      logIn(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration) //
      );
    }
  }, [logIn]);

  let routes;

  if (token) {
    //routes when logged in
    routes = (
      <React.Fragment>
        <Route path="/" element={<Users />} />
        <Route path="*" exact element={<Navigate to="/" replace />} />
        <Route path="/:userId/places" element={<UserPlaces></UserPlaces>} />
        <Route path="/places/new" exact element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />}></Route>
        <Route path="/user/profile" element={<UserProfile />}></Route>
        <Route path="/:userId/biddedItems" element={<BiddedItems />}></Route>
        <Route path="/:userId/market" element={<ItemMarket />}></Route>
      </React.Fragment>
    );
  } else {
    //route when not logged in
    routes = (
      <React.Fragment>
        <Route path="/" element={<Users />} />
        <Route path="*" exact element={<Navigate to="/auth" replace />} />
        <Route path="/:userId/places" element={<UserPlaces></UserPlaces>} />
        <Route path="/auth" element={<Auth />}></Route>
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: logIn,
        logout: logOut,
      }}
    >
      <React.Fragment>
        <MainNavigation />
        <main>
          {/* css iparxi mesto MainHeader.css gia to main tag */}
          <Routes>{routes}</Routes>
        </main>
      </React.Fragment>
    </AuthContext.Provider>
  );
};

export default App;
