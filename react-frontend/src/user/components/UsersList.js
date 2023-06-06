import React, { useState } from 'react';
import UserItem from './UserItem';
import './UsersList.css';

const UsersList = props => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = props.items.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(props.items.length / usersPerPage);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  if (currentUsers.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  }

  return (
    <div>
      <ul className="users-list">
        {currentUsers.map(user => (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places.length}
          />
        ))}
      </ul>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={currentPage === page ? 'active' : ''}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
