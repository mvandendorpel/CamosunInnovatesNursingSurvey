import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    ResponsiveContainer,
    Bar
  } from "recharts";
  

  const itemsEg1 = [
    {
      name: "Awake",
      value: 4
      
    },
    {
      name: "REM",
      value: 22
    },
    {
      name: "Light",
      value: 56
    },
    {
        name: "Deep",
        value: 18
    }
  ];


const items = itemsEg1;

const labelFormatter = (value) => {
    return value + '%';
};

const SleepChart = () => {
    const [data, setData] = useState([]);
    const apiURL = "https://10.51.253.2:3004/api/fb/sleep";
  const getSleepData = async () => {
    try {
        const sleepData = await axios(apiURL);
        console.log(sleepData.data);
        setData(sleepData.date);
    } catch (e) {
        console.log(e);
    }
  }

  useEffect(() => {
    getSleepData();
    }, []); 

  <div className="pie-row" >
    <ResponsiveContainer height={items.length * 80} width="100%">
      <BarChart
        data={items}
        margin={{ top: 0, right: 40, left: 45, bottom: 20 }}
        layout="vertical"
        barCategoryGap="10%"
        barGap={0}
        maxBarSize={20}
        stackOffset="expand"
      >
        <CartesianGrid horizontal={false} stroke="#a0a0a0" strokeWidth={1} />
        <XAxis
          type="number"
          axisLine={true}
          stroke="#a0a0a0"
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          strokeWidth={1}
        />
        <YAxis type="category" dataKey={"name"} width={20} minTickGap={0} />
        <Bar
          dataKey="value"
          animationDuration={1000}
          fill='#214971'
          label={{ position: "right", backgroundColor: "#fff", formatter: labelFormatter }}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
}



export default SleepChart;