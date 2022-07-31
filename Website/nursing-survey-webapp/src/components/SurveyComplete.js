import React, { useEffect, useState } from 'react';
import SurveyHeader from './SurveyHeader';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import axios from 'axios';
import jwtDecode, { JwtPayload } from "jwt-decode";
import "./SurveyComplete.css"

const SurveyComplete = ()  => {

    const authToken = window.localStorage.getItem('authToken'); // retrieves the saved token from localstorage
    const decoded = jwtDecode(authToken); 
    const userID = decoded.userID  
    const [data, setData] = useState([]);
    const apiURL = "https://10.51.253.2:3004/api/lastsubmission";
    const getUserStats = async () => {
        try {
            const userData = await axios.get(`${apiURL}?nurses_id=${userID}`);
            setData(userData.data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getUserStats();
    }, []); 

    console.log(data);

    const results = data?.results[0];
    const stepdata = results.step_activity_all['activities-steps']?.[0].value;
    let heartdata = "no data"
    if (typeof results.hr_activity_all['activites-heart']?.[0].value.restingHeartRate != "undefined"){
        heartdata = results.hr_activity_all['activites-heart']?.[0].value.restingHeartRate;
    }
    
    return(
        <>
            <SurveyHeader title={'Thanks!'} />
            <Box sx={{width:"80%", mx: "auto", mt: 2}} >
                <Typography variant="h4" gutterBottom component="div">
                    Your Steps 
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                    {stepdata}
                </Typography>
                <Typography variant="h4" gutterBottom component="div">
                    Your Heart Rate 
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                    {heartdata}
                </Typography>
                <Typography variant="h4" gutterBottom component="div">
                    Your Responses
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                    h6. Heading
                </Typography>
            </Box>
        </>
        
        
    );
}

export default SurveyComplete;