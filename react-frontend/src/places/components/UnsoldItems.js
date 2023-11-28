import React from "react";

const formatCreationDate = (creationDate) => {
  const itemDate = new Date(creationDate);
  return `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${itemDate.getDate().toString().padStart(2, '0')} ${itemDate
    .getHours()
    .toString()
    .padStart(2, '0')}:${itemDate.getMinutes().toString().padStart(2, '0')}:${itemDate
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;
};

const UnsoldItems = (props) => {
  if (!props.unsoldItems || props.unsoldItems.length === 0) {
    return <p>No items available</p>;
  }

  return (
    <div className="sold-items-container">
      {props.unsoldItems.map((item) => (
        <div className="sold-item" key={item._id}>
          <img className='imgforpast'  src={`http://localhost:5000/${item.image}`} alt={item.title} />
          <h3>{item.title}</h3>
          <p>Description: <strong>{item.description}</strong></p>
          <p>Category: <strong>{item.category.name}</strong></p>
          <p>Creation Date: <strong>{formatCreationDate(item.creationDate)}</strong></p>
          <p>Expiration Time: <strong>{formatCreationDate(item.dateTime)}</strong></p>
          {/* Add more information as needed */}
        </div>
      ))}
    </div>
  );
};

export default UnsoldItems;
