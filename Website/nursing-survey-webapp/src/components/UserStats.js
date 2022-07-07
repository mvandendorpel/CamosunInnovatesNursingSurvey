import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SurveyHeader from './SurveyHeader';
import SleepChart from './SleepChart.js';
import FatigueChart from './FatigueChart.js';
import Typography from '@mui/material/Typography';
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
                    Heart Rate
                </Typography>
                Data TBD
                <Typography ml={2} variant="h6" gutterBottom component="div">
                    Fatigue Levels
                </Typography>
                <FatigueChart />
            </Box>
            
        </>
    );
}

export default UserStats;