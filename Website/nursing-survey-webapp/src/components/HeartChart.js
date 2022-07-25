import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";



const HeartChart = (props) => {
    const data = [];

/* const rand = 90;
for (let i = 0; i < 7; i++) {
  let d = {
    day: ('03-2') + i,
    value: Math.random() * (rand + 0)
  };

  data.push(d);
} */
function waitForElement(){
  if(typeof props.data !== "undefined"){
    (props.data).forEach(item => {
      let i = {
        day: item.dateTime,
        value: item.restingHeartRate
      };
      data.push(i);
    });
  } else {
    setTimeout(waitForElement, 250);
  }
}


console.log(props.data);
waitForElement();
    return (
        <>
            <ResponsiveContainer height={200} width={"95%"}>
                <LineChart
                    data={data}
                    
                >
                    <Line type="monotone" dataKey="value" stroke="#214971" dot={true} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                </LineChart>            
            </ResponsiveContainer>
      </>
      );
}

export default HeartChart;