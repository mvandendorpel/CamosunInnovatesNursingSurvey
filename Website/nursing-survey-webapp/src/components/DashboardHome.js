import React, { useEffect, useState, useLayoutEffect } from 'react';
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
import axios from 'axios';
import jwtDecode, { JwtPayload } from "jwt-decode";
import './DashboardHome.css'
const DashboardHome = () => {
  const authToken = window.localStorage.getItem('authToken'); // retrieves the saved token from localstorage
  const decoded = jwtDecode(authToken); 
  const userID = decoded.userID  
  const [data, setData] = useState([]);
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const apiURL = "https://10.51.253.2:3004/api/dashboard";
  console.log(userID);
  const getUserInfo = async () => {
    try {
        const userData = await axios.get(`${apiURL}?nurses_id=${userID}`);
        setData(userData.data);
        setDaily(userData.data.dailySurveyList);
        setWeekly(userData.data.weeklySurveyList);
        console.log(userData.data)
        console.log(userID);
    } catch (e) {
        console.log(e);
        console.log("hello");
    }
  }

  useEffect(() => {
    getUserInfo();
    
  }, []); 


  const dailyArray = (daily);
  const weeklyArray = (weekly);
  console.log(weeklyArray);
  function getIncompleteSurveys(fullArray){
    let incompleteArray = fullArray.map((item) => {
      if (item.surveyComplete == false){ //appends to new array if the user hasn't completed a survey
        return item.surveyDate;
      }
    });
    incompleteArray = incompleteArray.filter(e => e);
    return incompleteArray;
  }

  const incompleteDaily = getIncompleteSurveys(dailyArray);
  const incompleteWeekly = getIncompleteSurveys(weeklyArray);

  return (
    <>
      <SurveyHeader title={'Welcome!'} />
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
          </ul>
          <ul>
            <ListSubheader>{"Daily Surveys"}</ListSubheader>
            {incompleteDaily.map((item) => (
                  <ListItem key={`item-${item}`}>
                    <Button size="small" sx={{color:"black"}} component={Link} to="/survey/1" state={{date: `${item}`}}><ListItemText primary={`${item}`} /></Button>
                  </ListItem>
                ))}
          </ul>
          
        </List>
      </Box>
    </>
  );
};
export default DashboardHome;