import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const HeartChart = (props) => {
  const data = [];

  function waitForElement(){
    if(typeof props.data !== "undefined"){
      (props.data).forEach(item => { // pushes each item of heart rate data to the array for the chart
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