import React, { useEffect, useState } from 'react';
import SurveyHeader from './SurveyHeader';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "./SurveyComplete.css"

const SurveyComplete = (props)  => {

    const [step, setStep] = useState();
    const [heart, setHeart] = useState();
    const [responses, setResponses] = useState([]);
    const respList = [];
    
    useEffect(() => {
        const onPageLoad = () => {
            let data = props.data.results;
            setStep(data[0]?.step_activity_all['activities-steps']?.[0].value);
            setHeart(data[0]?.hr_activity_all['activities-heart']?.[0].value.restingHeartRate);
            setResponses(props.data.surveyQuestions);
        };
      
          // Check if the page has already loaded
          if (document.readyState === "complete") {
            onPageLoad();
            
          } else {
            window.addEventListener("load", onPageLoad);
            // Remove the event listener when component unmounts
            return () => window.removeEventListener("load", onPageLoad);
          }
    }, []);
    
    responses.forEach((item) => {
        respList.push(<p key={item.id} >Q: {item.questionText} <br/> A: {item.answer}</p>) 
    })
    
    return(
        <>
            <SurveyHeader title={'Thanks!'} />
            <Box sx={{width:"80%", mx: "auto", mt: 4}} >
                <Typography variant="h4" gutterBottom component="div">
                    Your Steps 
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                    {step ?? "Not yet loaded"}
                </Typography>
                <Typography variant="h4" gutterBottom component="div">
                    Your Heart Rate 
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                    {heart ?? "Not yet loaded"}
                </Typography>
                <Typography variant="h4" gutterBottom component="div">
                    Your Responses
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                   {respList ?? "Not yet loaded"}
                </Typography>
            </Box>
        </>
        
        
    );
}

export default SurveyComplete;