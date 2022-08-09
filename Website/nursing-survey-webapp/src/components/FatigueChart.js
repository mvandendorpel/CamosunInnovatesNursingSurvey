import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const FatigueChart = (props) => {

  const items = [];
  function waitForElement(){
    if(typeof props.data !== "undefined"){
      (props.data).forEach((item, index) => {
        let i = {
          name: index+=1,
          value: item
        };
        items.push(i);
      });
    } else {
      setTimeout(waitForElement, 250);
    }
  }
  console.log(props.data);
  waitForElement();
  return (
    <>
      <ResponsiveContainer height={200} width={"100%"}>
        <BarChart
          data={items}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
          barGap={0}
          maxBarSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
          />
          <YAxis/>
          <Bar
            dataKey="value"
            animationDuration={1000}
            fill='#214971'
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default FatigueChart;