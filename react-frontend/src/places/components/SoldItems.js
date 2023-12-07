import React, { useEffect, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./SoldItems.css";

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

const SoldItems = (props) => {
  const { sendRequest } = useHttpClient();
  const [soldItems, setSoldItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
  };

  useEffect(() => {
    const fetchSoldItemsData = async () => {
      try {
        const updatedSoldItems = await Promise.all(
          props.soldItems.map(async (item) => {
            // Fetch user data for highestBidder
            const highestBidderResponse = await sendRequest(
              `http://localhost:5000/api/users/getuser/${item.highestBidder}`
            );
            const highestBidderName = highestBidderResponse.user.name;

            return {
              ...item,
              highestBidder: highestBidderName,
            };
          })
        );

        setSoldItems(updatedSoldItems);
      } catch (error) {
        console.error("Error fetching sold items data:", error);
      }
    };

    if (props.soldItems && props.soldItems.length > 0) {
      fetchSoldItemsData();
    }
  }, [props.soldItems, sendRequest]);

  const filteredSoldItems = selectedMonth
    ? soldItems.filter((item) => {
        const itemMonth = new Date(item.dateTime).getMonth() + 1; // Adding 1 because months are zero-indexed
        return itemMonth === selectedMonth;
      })
    : soldItems;

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
            <div className="margbot" key={item._id}>
              <Card>
                <div className="sold-item">
                  <img
                    className="imgforpast "
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
                  <p>
                    Bids Placed For Item: <strong>{item.bids.length}</strong>
                  </p>
                  <p>
                    Highest Bidder: <strong>{item.highestBidder}</strong>
                  </p>
                  <p>
                    Highest Bid: <strong>€{item.highestBid}</strong>
                  </p>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SoldItems;
