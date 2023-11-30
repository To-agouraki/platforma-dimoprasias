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
import AdminLogIn from "./user/pages/AdminLogIn";
import AdminMainPage from "./user/pages/AdminMainPage";
import CategoriesPage from "./adminOnly/pages/CategoriesPage";
import NewCategory from "./adminOnly/pages/NewCategory";
import UpdateCategory from "./adminOnly/pages/UpdateCategory";
import UserMainPage from "./user/pages/UserMainPage";
//import NoUserDashboard from "./user/components/NoUserDashboard";
//import UpdateNormalUser from "./adminOnly/pages/UpdateNormalUser";
import DeactivatedItems from "./adminOnly/pages/DeactivateItems";
import AllItems from "./adminOnly/pages/AllItems";
import ExpiredItems from "./adminOnly/pages/ExpiredItems";
import SystemStatistics from "./adminOnly/pages/SystemStatistics";
import WelcomePage from "./welcomepage/pages/WelcomePage";
import ItemsCategory from "./welcomepage/pages/ItemsCategory";
import UserInformation from "./adminOnly/pages/UserInformation";
import PastItems from "./places/pages/PastItems";
import WonItems from "./places/pages/WonItems";

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

console.log("admin", isAdminLoggedIn);

  const logIn = useCallback(
    (uid, token, expirationDate, adminIsLogged = false) => {
      setIsAdminLoggedIn(adminIsLogged);
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
          isAdminLoggedIn: adminIsLogged,
        })
      );
    },
    []
  );

  const adminLogIn = useCallback(
    (uid, token, expirationDate) => {
      logIn(uid, token, expirationDate, true);
    },
    [logIn]
  );

  const logOut = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
   // localStorage.removeItem("userData");
    //localStorage.removeItem("messages");
    localStorage.clear();
  }, []);

console.log("from app",localStorage.getItem('messages'));

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
      new Date(storedData.expiration) > new Date()
      //an en pio megali pou tin torasini sirno nea
    ) {
      logIn(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
        storedData.isAdminLoggedIn //
      );
    }
  }, [logIn]);

  let routes;

  if (token && isAdminLoggedIn) {
    //routes when logged in
    routes = (
      <React.Fragment>
        <Route path="/" exact element={<AdminMainPage />}></Route>
        <Route path="/users" element={<Users />} />
        <Route path="*" exact element={<Navigate to="/" replace />} />
        <Route path="/:userId/places" element={<UserPlaces></UserPlaces>} />
        <Route path="/places/new" exact element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />}></Route>
        <Route path="/:userId/biddedItems" element={<BiddedItems />}></Route>
        <Route path="/allitems/items" element={<AllItems />}></Route>
        <Route path="/allitems/expired" element={<ExpiredItems />}></Route>
        <Route path="/categories/new" element={<NewCategory />}></Route>
        <Route path="/categories/:categoryId" element={<UpdateCategory />}></Route>
        <Route path="/categories" element={<CategoriesPage />}></Route>
        <Route path="/userInfo/:userId" element={<UserInformation />}></Route>
        <Route path="/deactivatedItems" element={<DeactivatedItems />}></Route>
        <Route path="/systemStatistics" element={<SystemStatistics />}></Route>
      </React.Fragment>
    );
  } else if (token) {
    //route when user is logged in
    routes = (
      <React.Fragment>
        <Route path="/" element={<UserMainPage />} />
        <Route path="*" exact element={<Navigate to="/" replace />} />
        <Route path="/:userId/places" element={<UserPlaces></UserPlaces>} />
        <Route path="/places/new" exact element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />}></Route>
        <Route path="/user/profile" element={<UserProfile />}></Route>
        <Route path="/:userId/biddedItems" element={<BiddedItems />}></Route>
        <Route path="/market" element={<ItemMarket />}></Route>
        <Route path="/pastItems/:userId" element={<PastItems />}></Route>
        <Route path="/wonItems/:userId" element={<WonItems />}></Route>


      </React.Fragment>
    );
  } else {
    //noone is logged in
    routes = (
      <React.Fragment>
        <Route path="/" element={<WelcomePage />} />
        <Route path="*" exact element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/market" element={<ItemMarket />}></Route>
        <Route path="/adminAuth" element={<AdminLogIn />}></Route>
        <Route path="/categoryProducts/:categoryId" element={<ItemsCategory />}></Route>
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        isAdmin: isAdminLoggedIn,
        token: token,
        userId: userId,
        isAdminLogIn: adminLogIn,
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
