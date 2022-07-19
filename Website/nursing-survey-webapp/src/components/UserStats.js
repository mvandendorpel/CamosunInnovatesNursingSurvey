import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SurveyHeader from './SurveyHeader';
import SleepChart from './SleepChart.js';
import FatigueChart from './FatigueChart.js';
import HeartChart from './HeartChart.js';
import Typography from '@mui/material/Typography';
import "./UserStats.css";
const UserStats = () => {
    const title = 'My Stats';
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
                <HeartChart />
                <Typography ml={2} variant="h6" gutterBottom component="div">
                    Fatigue Levels
                </Typography>
                <FatigueChart />
                
            </Box>
            
        </>
    );
}

export default UserStats;