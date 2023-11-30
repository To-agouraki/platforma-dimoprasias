import React, {useEffect, useRef}from "react";
import Card from "../../shared/components/UIElements/Card";

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

const unsoldItems= props.unsoldItems;

  const maxHeightRef = useRef(0);


  useEffect(() => {
    // Find the maximum height among all sold items
    const soldItemElements = document.querySelectorAll(".sold-item");
  
    soldItemElements.forEach((el) => {
      maxHeightRef.current = Math.max(maxHeightRef.current, el.offsetHeight);
    });
  
    // Set the maximum height for all sold items
    soldItemElements.forEach((el) => {
      el.style.height = `${maxHeightRef.current}px`;
    });
  }, [unsoldItems]);


  if (!props.unsoldItems || props.unsoldItems.length === 0) {
    return  <Card><p>No items available</p></Card> ;
  }

  return (
    <div className="sold-items-container">
      {unsoldItems.map((item) => (
        <div className="margbot">
        <Card>
        <div className="sold-item" key={item._id}>
          <img className='imgforpast'  src={`http://localhost:5000/${item.image}`} alt={item.title} />
          <h3>{item.title}</h3>
          <p>Description: <strong>{item.description}</strong></p>
          <p>Category: <strong>{item.category.name}</strong></p>
          <p>Creation Date: <strong>{formatCreationDate(item.creationDate)}</strong></p>
          <p>Expiration Time: <strong>{formatCreationDate(item.dateTime)}</strong></p>
          {/* Add more information as needed */}
        </div>
        </Card>
        </div>
      ))}
    </div>
  );
};

export default UnsoldItems;
