import React, { useEffect, useState } from 'react';
import SurveyHeader from './SurveyHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import './DashboardHome.css'
const DashboardHome = () => {
  const authToken = window.localStorage.getItem('authToken'); // retrieves the saved token from localstorage
  const decoded = jwtDecode(authToken); // decodes token
  const userID = decoded.userID;  // gets userID from token
  //const [data, setData] = useState([]); // response data
  const [daily, setDaily] = useState([]); // daily survey data from response
  const [weekly, setWeekly] = useState([]); // weekly survey data from response
  const [open, setOpen] = React.useState(true);
  const apiURL = "https://10.51.253.2:3004/api/dashboard";
  const desiredLength = 7;
  const getUserInfo = async () => {
    try {
        const userData = await axios.get(`${apiURL}?nurses_id=${userID}`);
        //setData(userData.data);
        setDaily(userData.data.dailySurveyList);
        setWeekly(userData.data.weeklySurveyList);
    } catch (e) {
        console.log(e);
    }
  }

  useEffect(() => {
    getUserInfo();
    
  }, []); 


  const dailyArray = (daily);
  const weeklyArray = (weekly);
  function getIncompleteSurveys(fullArray){ // filters all incomplete arrays from an array of surveys
    let incompleteArray = fullArray.map((item) => {
      if (item.surveyComplete === false){ //appends to new array if the user hasn't completed a survey
        return item.surveyDate;
      }
    });
    
    incompleteArray = incompleteArray.filter(e => e); // removes all null values from the array
    //incompleteArray = trimSurveyArray(incompleteArray);
    //incompleteArray.reverse();
    return incompleteArray;
  }

  function trimSurveyArray(surveyArray){ // trims the survey array to an arbitrary length
    surveyArray.length = Math.min(surveyArray.length, desiredLength);
    return surveyArray;
  }

  let incompleteDaily = getIncompleteSurveys(dailyArray);
  let incompleteWeekly = getIncompleteSurveys(weeklyArray);

  let dailyRemaining = incompleteDaily.length - desiredLength;
  let weeklyRemaining = incompleteWeekly.length - desiredLength;

  if (dailyRemaining <= desiredLength){
    dailyRemaining = "No"
  }
  
  if (weeklyRemaining <= desiredLength){
    weeklyRemaining = "No"
  }

  incompleteDaily = trimSurveyArray(incompleteDaily);
  incompleteWeekly = trimSurveyArray(incompleteWeekly);

  console.log(trimSurveyArray(incompleteDaily));

  return (
    <>
      <SurveyHeader title={'Welcome!'} />
      <Stack sx={{ alignItems: "center", justifyContent: "center" }} spacing={2}>
        <Collapse in={open}>
          <Alert
            severity="warning"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 1.5, mt: 2 }}
          >
            Please sync in the Fitbit app before completing any surveys today.
          </Alert>
        </Collapse>      
      </Stack>
      <Box sx={{  alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column"}}>

        <Stack className={'ButtonBox'} spacing={3} direction="row" sx={{justifyContent: "center", m:4}}>
            <Button component={Link} to="/survey/1" variant="contained" color="primary" onClick="window.location.reload();">
                Daily Survey
            </Button>
            <Button component={Link} to="/survey/2" variant="contained" color="primary" onClick="window.location.reload();">
                Weekly Survey
            </Button>
        </Stack>

        <Typography className={'DashTitle'} variant="h6" component="div" ml={2}>
          Incomplete Surveys
        </Typography>
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            
            '& ul': { padding: 0 },
          }}
          subheader={<li />}
        >
          
          <ul>
            <ListSubheader>{"Weekly Surveys"}</ListSubheader>
            
            {incompleteWeekly.map((item) => (
              <ListItem key={`item-${item}`}>
                <Button size="small" sx={{color:"black", size:"5px"}} component={Link} to="/survey/2" state={{date: `${item}`}}><ListItemText primary={`Week of ${item}`} /></Button>
              </ListItem>
            ))}
            <Typography variant="caption" gutterBottom ml={2}>
              {weeklyRemaining} additional surveys
            </Typography>
                
          </ul>
          <ul>
            <ListSubheader>{"Daily Surveys"}</ListSubheader>
            
            {incompleteDaily.map((item) => (
              <ListItem key={`item-${item}`}>
                <Button size="small" sx={{color:"black"}} component={Link} to="/survey/1" state={{date: `${item}`}}><ListItemText primary={`${item}`} /></Button>
              </ListItem>
            ))}
            <Typography variant="caption" gutterBottom ml={2}>
              {dailyRemaining} additional surveys
            </Typography>
             
          </ul>
          
        </List>
      </Box>
    </>
  );
};
export default DashboardHome;