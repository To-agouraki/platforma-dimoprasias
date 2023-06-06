import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import RatingBar from "../../shared/components/SharedComponent/RatingBar";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  //const [isLoading, setIsLoading] = useState(false);
  //const [nError, setNError] = useState();
  const {isLoading, nError, sendRequest, clearError} = useHttpClient();//gia kapio logo liturga {} anti gia []
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users"
        );
        setLoadedUsers(responseData.users);
      } catch (error) {}
    };
    fetchUsers();
  }, [sendRequest]);


  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      <RatingBar/>
    </React.Fragment>
  );
};

export default Users;

//logic without the custom hook

// useEffect(() => {
//   const sendRequest = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/users");
//       const responseData = await response.json();

//       if (!response.ok) {
//         //ok prop exist on the respone obj
//         throw new Error(responseData.message);
//       }
//       console.log(responseData.users);
//       setLoadedUsers(responseData.users);
//     } catch (error) {
//       setNError(error.message);
//     }
//     setIsLoading(false);
//   };
//   sendRequest();
// }, []);
