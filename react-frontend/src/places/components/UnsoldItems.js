import React, { useEffect, useRef, useState } from "react";
import Card from "../../shared/components/UIElements/Card";

const formatCreationDate = (creationDate) => {
  const itemDate = new Date(creationDate);
  return `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${itemDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${itemDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${itemDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${itemDate.getSeconds().toString().padStart(2, "0")}`;
};

const UnsoldItems = (props) => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
  };

  const unsoldItems = props.unsoldItems;

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
    return (
      <Card>
        <p>No items available</p>
      </Card>
    );
  }

  const filteredSoldItems = selectedMonth
    ? props.unsoldItems.filter((item) => {
        const itemMonth = new Date(item.dateTime).getMonth() + 1; // Adding 1 because months are zero-indexed
        return itemMonth === selectedMonth;
      })
    : props.unsoldItems;

  return (
    <div>
      <select
        className="month-select"
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        <option value={null}>All Months</option>
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </select>
      <br></br>
      <br></br>
      <div className="sold-items-container">
        {filteredSoldItems.length === 0 ? (
          <Card>
            <p>No items available for the selected month.</p>
          </Card>
        ) : (
          filteredSoldItems.map((item) => (
            <div className="margbot">
              <Card>
                <div className="sold-item" key={item._id}>
                  <img
                    className="imgforpast"
                    src={`http://localhost:5000/${item.image}`}
                    alt={item.title}
                  />
                  <h3>{item.title}</h3>
                  <p>
                    Description: <strong>{item.description}</strong>
                  </p>
                  <p>
                    Category: <strong>{item.category.name}</strong>
                  </p>
                  <p>
                    Creation Date:{" "}
                    <strong>{formatCreationDate(item.creationDate)}</strong>
                  </p>
                  <p>
                    Expiration Time:{" "}
                    <strong>{formatCreationDate(item.dateTime)}</strong>
                  </p>
                  {/* Add more information as needed */}
                </div>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UnsoldItems;
