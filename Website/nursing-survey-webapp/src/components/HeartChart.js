import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";



const HeartChart = () => {

    /* const decoded = jwtDecode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjQ1LCJpYXQiOjE2NTcxNzY5MzUsImV4cCI6MTY1NzE4MDUzNX0.n9NHqEDERDcfabTreVGA6i2QW0UQawtRRrjw-Kb2Ejk'); //The secret is currently stored in the .env file in the API folder, not sure if you can access it from there directly or need a copy on your end
  const userID = decoded.userID  
  console.log(userID)
  const [data, setData] = useState([]);
  const apiURL = "https://10.51.253.2:3004/api/allsurveys";
  const getHeartData = async () => {
    try {
        const heartData = await axios(`${apiURL}?nurses_id=${userID}`);
        console.log(heartData.data);
        setData(heartData.data);
    } catch (e) {
        console.log(e);
    }
  } */

  /* useEffect(() => {
    getHeartData();
    }, []);  */

    const data = [];

const rand = 90;
for (let i = 0; i < 7; i++) {
  let d = {
    day: ('03-2') + i,
    value: Math.random() * (rand + 0)
  };

  data.push(d);
}

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