import React, { useState } from 'react';
import HeaderImage from './header-image.svg';
import Typography from '@mui/material/Typography';

import './SurveyHeader.css'
const SurveyHeader = () => {
    
    return (
        <React.Fragment>
            <Typography className="survey-header" variant="h4" component="div" gutterBottom sx={{ml: 3, mt: 7.5, color: "white"}}>
                Weekly Survey
            </Typography>
            <img src={HeaderImage} alt="header"/>
        </React.Fragment>
    )
}

export default SurveyHeader;