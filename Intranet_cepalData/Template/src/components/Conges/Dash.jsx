import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dash({ name, color1, color2, length, maxValue}) { 
  let soldes = maxValue - length 
  if(soldes < 0 ) { 
    soldes = 0 
  } 
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: false,
        text: "Soldes",
      },
    },
  };

  const chartData = {
    labels: ["restants",  "prise" ],
    datasets: [
      {
        label: "values",
        data: [soldes, length],
        backgroundColor: [color1, color2],
        weight: 0.25,
      },
    ],
  };
  return (
    <div className="w-full">
      <div className="p-4 rounded-lg bg-white mt-1 w-full h-full flex justify-between items-center">
        {/* Left: Text */}
        <div className="mx-2 items-start">
          <span className="text-lg font-light">{name}</span> 
          <br />
          <span className={`text-5xl ${soldes == 0 ? "text-red-500" : ''}`}> {soldes} </span> 
        </div>

        {/* Right: Chart */}
        <div className="p-2" style={{ width: "150px", height: "150px" }}>
          <Doughnut
            options={chartOptions}
            data={chartData}
          />
        </div>
      </div> 
    </div>
  );
}
