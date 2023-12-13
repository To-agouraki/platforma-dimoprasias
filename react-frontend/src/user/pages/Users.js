import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Searchbarcss.css";

const Users = () => {
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = loadedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />
      <div className="search-containerUser center">
        <label className="search-labelUser" htmlFor="search">
          Search by name:
        </label>
        <input
          className="search-inputUser"
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers.length > 0 && (
        <UsersList items={filteredUsers} />
      )}
    </React.Fragment>
  );
};

export default Users;
