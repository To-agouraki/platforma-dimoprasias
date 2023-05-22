import React, { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import UserProfile from "./user/pages/UserProfile";
import BiddedItems from './places/pages/BiddedItems';
import { AuthContext } from "./shared/components/context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [userId, setUserId] = useState(false);

  const logIn = useCallback((uid) => {
    setIsLoggedin(true);
    setUserId(uid);
  }, []);

  const logOut = useCallback(() => {
    setIsLoggedin(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    //routes when logged in
    routes = (
      <React.Fragment>
        <Route path="/" element={<Users />} />
        <Route path="*" exact element={<Navigate to="/" replace />} />
        <Route path="/:userId/places" element={<UserPlaces></UserPlaces>} />
        <Route path="/places/new" exact element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />}></Route>
        <Route path="/user/profile" element={<UserProfile/>}></Route>
        <Route path="/:userId/biddedItems" element={<BiddedItems/>}></Route>
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
        isLoggedIn: isLoggedIn,
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
