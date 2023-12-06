import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import "./PieCharts.css";

const Charts = (props) => {
  // Use state to store data
  const [activeItemsData, setActiveItemsData] = useState([]);
  const [allItemsData, setAllItemsData] = useState([]);
  const [unsoldItemsData, setUnsoldItemsData] = useState([]);
  const [soldItemsData, setSoldItemsData] = useState([]);


  useEffect(() => {
    // Update state when props change
    if (props.categoryCounters) {
      setActiveItemsData(props.categoryCounters.activeItemsCategoryNames || []);
      setAllItemsData(props.categoryCounters.allItemsCategoryNames || []);
      setUnsoldItemsData(
        props.categoryCounters.unsoldItemsCategoryNames || []
      );
      setSoldItemsData(props.categoryCounters.soldItemsCategoryNames || []);
    }
  }, [props.categoryCounters]);

  return (
    <React.Fragment>
      <div className="pieChartContent">
        <div className="pieChartContainer">
          <h2>All Items</h2>
          <PieChart width={300} height={340}>
            <Pie
              data={allItemsData}
              cx={150}
              cy={150}
              outerRadius={90}
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
          <h2>Active Items</h2>
          <PieChart width={300} height={340}>
            <Pie
              data={activeItemsData}
              cx={150}
              cy={150}
              outerRadius={90}
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
          <h2>Unsold Items</h2>
          <PieChart width={300} height={340}>
            <Pie
              data={unsoldItemsData}
              cx={150}
              cy={150}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label
            >
              {unsoldItemsData.map((entry, index) => (
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
          <h2>Sold Items</h2>
          <PieChart width={300} height={340}>
            <Pie
              data={soldItemsData}
              cx={150}
              cy={150}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label
            >
              {soldItemsData.map((entry, index) => (
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
