// Import necessary components from Recharts
import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

// Dummy data (replace this with your actual data)
const data = [
  { name: "Video Games", value: 20 },
  { name: "Electronics", value: 30 },
  { name: "Books", value: 15 },
  { name: "gay", value: 25 },
  { name: "homo", value: 11 },
  // Add more categories and values as needed
];

const Charts = () => {
  return (
    <React.Fragment>
        <h2>hahahah</h2>
    <PieChart width={400} height={400}>
      
      <Pie
        data={data}
        cx={200}
        cy={200}
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {/* Define colors for each category */}
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
        ))}
      </Pie>
      {/* Add a legend */}
      <Legend />
    </PieChart>
    </React.Fragment>
  );
};

export default Charts;
