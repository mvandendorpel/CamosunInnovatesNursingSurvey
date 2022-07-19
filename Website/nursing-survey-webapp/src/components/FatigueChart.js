import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const items = [
    {
      "name":"1",
      "value":2
   },
   {
      "name":"2",
      "value":3
   },
   {
      "name":"4",
      "value":5
   },
   {
      "name":"4",
      "value":4
   },
   {
      "name":"5",
      "value":5
   },
   {
      "name":"6",
      "value":2
   },
   {
      "name":"7",
      "value":1
   }
  ];


const Test = () => {

  /* const decoded = jwtDecode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjQ1LCJpYXQiOjE2NTcxNzY5MzUsImV4cCI6MTY1NzE4MDUzNX0.n9NHqEDERDcfabTreVGA6i2QW0UQawtRRrjw-Kb2Ejk'); //The secret is currently stored in the .env file in the API folder, not sure if you can access it from there directly or need a copy on your end
  const userID = decoded.userID  
  console.log(userID)
  const [data, setData] = useState([]);
  const apiURL = "https://10.51.253.2:3004/api/allsurveys";
  const getFatigueData = async () => {
    try {
        const fatigueData = await axios(`${apiURL}?nurses_id=${userID}`);
        console.log(fatigueData.data);
        setData(fatigueData.data);
    } catch (e) {
        console.log(e);
    }
  }

  useEffect(() => {
    getFatigueData();
    }, []);  */
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

export default Test;