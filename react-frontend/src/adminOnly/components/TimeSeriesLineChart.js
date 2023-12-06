// TimeSeriesLineChart.js
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./TimeSeriesLineChart.css";

const TimeSeriesLineChart = (props) => {
  const [placesData, setPlacesData] = useState([]);

  useEffect(() => {
    if (props.placesData) {
      setPlacesData(props.placesData);
    }
  }, [props.placesData]);

  // Organize places data by creation date
  const placesByDate = placesData.reduce((acc, place) => {
    const date = new Date(place.creationDate).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dataForLineChart = Object.keys(placesByDate).map((date) => ({
    date,
    count: placesByDate[date],
  }));

  return (
    <div className="timeSeriesLineChartContainer">
      <h2>Place Creation Over Time</h2>
      <div className="lineChart">
        <LineChart width={1200} height={400} data={dataForLineChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </div>
    </div>
  );
};

export default TimeSeriesLineChart;
