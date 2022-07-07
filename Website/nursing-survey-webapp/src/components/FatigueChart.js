import React from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
  const itemsEg1 = [
    {
      name: "1",
      value: 2
      
    },
    {
      name: "2",
      value: 3
    },
    {
      name: "4",
      value: 5
    },
    {
      name: "4",
      value: 4
    },
    {
      name: "5",
      value: 5
    },
    {
      name: "6",
      value: 2
    },
    {
      name: "7",
      value: 1
    }
  ];

const items = itemsEg1;

const FatigueChart = () => (
  <>
    <ResponsiveContainer height={200} width="100%">
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


export default FatigueChart;