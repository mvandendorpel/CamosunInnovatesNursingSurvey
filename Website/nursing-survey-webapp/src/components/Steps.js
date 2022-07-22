import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SurveyHeader from './SurveyHeader';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import jwtDecode, { JwtPayload } from "jwt-decode";

import "./UserStats.css";
const Steps = (props) => {
    const title = 'My Steps';

    const authToken = window.localStorage.getItem('authToken'); // retrieves the saved token from localstorage
    const decoded = jwtDecode(authToken); 
    const userID = decoded.userID  
    const [data, setData] = useState([]);
    const apiURL = "https://10.51.253.2:3004/api/stepcount";
    const getUserStats = async () => {
        try {
            const userData = await axios.get(`${apiURL}?nurses_id=${userID}`);
            setData(userData.data);
            console.log(userID);
            console.log(userData.data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getUserStats();
        console.log(data);
    }, []); 

    return(
        <>
            <SurveyHeader title={ title} />

            <Box sx={{ width: '100%' }}>
                <Typography ml={2} mt={2} variant="h6" gutterBottom component="div">
                    Cumulative Steps
                </Typography>
                <Typography ml={2} variant="h2" gutterBottom component="div">
                    {data.totalSteps}
                </Typography>
                <Typography ml={2} variant="h6" gutterBottom component="div">
                    Average Steps per Day
                </Typography>
                <Typography ml={2} variant="h2" gutterBottom component="div">
                    {data.avgSteps}
                </Typography>
                <Typography ml={2} variant="h6" gutterBottom component="div">
                    Steps Today
                </Typography>
                <Typography ml={2} variant="h2" gutterBottom component="div">
                    {data.todaySteps}
                </Typography>
                
            </Box>
            
        </>
    );
}

export default Steps;