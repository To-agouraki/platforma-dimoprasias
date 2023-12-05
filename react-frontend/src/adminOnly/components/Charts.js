import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import "./PieCharts.css";

const Charts = (props) => {
  // Use state to store data
  const [activeItemsData, setActiveItemsData] = useState([]);
  const [allItemsData, setAllItemsData] = useState([]);
  const [expiredItemsData, setExpiredItemsData] = useState([]);

  useEffect(() => {
    // Update state when props change
    if (props.categoryCounters) {
      setActiveItemsData(props.categoryCounters.activeItemsCategoryNames || []);
      setAllItemsData(props.categoryCounters.allItemsCategoryNames || []);
      setExpiredItemsData(
        props.categoryCounters.expiredItemsCategoryNames || []
      );
    }
  }, [props.categoryCounters]);

  return (
    <React.Fragment>
      <div className="pieChartContent">
        <div className="pieChartContainer">
          <h2>Active Items</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={activeItemsData}
              cx={150}
              cy={150}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label
            >
              {activeItemsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}`}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>

        <div className="pieChartContainer">
          <h2>All Items</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={allItemsData}
              cx={150}
              cy={150}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label
            >
              {allItemsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}`}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>

        <div className="pieChartContainer">
          <h2>Expired Items</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={expiredItemsData}
              cx={150}
              cy={150}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label
            >
              {expiredItemsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}`}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Charts;
