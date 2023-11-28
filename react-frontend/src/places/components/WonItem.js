
// WonItems.js
import React from "react";
import "./WonItems.css"; // Import your CSS file

const WonItem = (props) => {
  const wonItems = props.wonItems;

  if (!wonItems || wonItems.length === 0) {
    return <p>No won items available.</p>;
  }

//   return (
//     <div className="won-items-container">
//       {wonItems.map((item) => (
//         <div className="won-item" key={item._id}>
//           <img src={`http://localhost:5000/${item.image}`} alt={item.title} />
//           <h3>{item.title}</h3>
//           <p>Description: <strong>{item.description}</strong></p>
//           <p>Category: <strong>{item.category.name}</strong></p>
//           <p>Time Since Expiration: <strong>{calculateTimeDifference(item.expirationDate)}</strong></p>
//           <p>Highest Bid: ${item.highestBid}</p>
//           {/* Add more information as needed */}
//         </div>
//       ))}
//     </div>
//   );
};

export default WonItem;
