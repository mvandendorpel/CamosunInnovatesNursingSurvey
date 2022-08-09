import React, { useEffect, useState } from 'react';

import {
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    ResponsiveContainer,
    Bar
  } from "recharts";
  
const items = [ // data format for chart, gets overwritten by data from props
  {
    name: "Awake",
    value: 0
  },
  {
    name: "REM",
    value: 0
  },
  {
    name: "Light",
    value: 0
  },
  {
    name: "Deep",
    value: 0
  }
];

function calPercnt(num, total){ // takes the total minutes of sleep and calculates a percentage of each type of sleep
  const result = (num / total) * 100
  return parseFloat(result.toFixed(0));
}


const labelFormatter = (value) => { // adds a percentage to the charts
    return value + '%';
};

const SleepChart = (props) => {
  
  function waitForElement(){
    if(typeof props.data !== "undefined"){
      const totalSleepMins = (props.data[0].deep + props.data[0].light + props.data[0].rem + props.data[0].wake); // total number of minutes asleep
      items[0].value = calPercnt(props.data[0].wake, totalSleepMins); // sets awake time
      items[1].value = calPercnt(props.data[0].rem, totalSleepMins); // sets rem time
      items[2].value = calPercnt(props.data[0].light, totalSleepMins); // sets light time
      items[3].value = calPercnt(props.data[0].deep, totalSleepMins); // sets deep time
    } else {
      setTimeout(waitForElement, 250);
    }
  }

  waitForElement();

  return(
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
  );
}



export default SleepChart;