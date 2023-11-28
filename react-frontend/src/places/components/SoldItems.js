import React from "react";
import "./SoldItems.css"; // Import your CSS file

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



const SoldItems = (props) => {
  const soldItems = props.soldItems;

  if (!props.soldItems || props.soldItems.length === 0) {
    return <p>No sold items available.</p>;
  }

  return (
    <div className="sold-items-container">
      {soldItems.map((item) => (
        <div className="sold-item" key={item._id}>
          <img className='imgforpast 'src={`http://localhost:5000/${item.image}`} alt={item.title} />
          <h3>{item.title}</h3>
          <p>Description: <strong>{item.description}</strong></p>
          <p>Category: <strong>{item.category.name}</strong></p>
          <p>Creation Date: <strong>{formatCreationDate(item.creationDate)}</strong></p>
          <p>Expiration Time: <strong>{formatCreationDate(item.dateTime)}</strong></p>
          <p>Bids Placed For Item: <strong>{item.bids.length}</strong></p>
          <p>Highest Bid: <strong>${item.highestBid}</strong></p>
          {/* Add more information as needed */}
        </div>
      ))}
    </div>
  );
};

export default SoldItems;
