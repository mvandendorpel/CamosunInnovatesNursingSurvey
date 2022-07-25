import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SurveyHeader from './SurveyHeader';
import SleepChart from './SleepChart.js';
import FatigueChart from './FatigueChart.js';
import HeartChart from './HeartChart.js';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import jwtDecode, { JwtPayload } from "jwt-decode";

import "./UserStats.css";
const UserStats = (props) => {
    const title = 'My Stats';

    const authToken = window.localStorage.getItem('authToken'); // retrieves the saved token from localstorage
    const decoded = jwtDecode(authToken); 
    const userID = decoded.userID  
    const [data, setData] = useState([]);
    const apiURL = "https://10.51.253.2:3004/api/userstats";
    const getUserStats = async () => {
        try {
            const userData = await axios.get(`${apiURL}?nurses_id=${userID}`);
            setData(userData.data);
            console.log(userData.data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getUserStats();
    }, []); 
    console.log(data.heartRateResponse);
    return(
        <>
            <SurveyHeader title={ title} />

            <Box sx={{ width: '100%' }}>
                <Typography ml={2} variant="h6" gutterBottom component="div">
                    Sleep
                </Typography>
                <SleepChart />
                <Typography ml={2} variant="h6" gutterBottom component="div">
                    Base Heart Rate
                </Typography>
                <HeartChart data={data.heartRateResponse}/>
                <Typography ml={2} variant="h6" gutterBottom component="div">
                    Fatigue Levels
                </Typography>
                <FatigueChart data={data.fatigueResponse}/>
                
            </Box>
            
        </>
    );
}

export default UserStats;