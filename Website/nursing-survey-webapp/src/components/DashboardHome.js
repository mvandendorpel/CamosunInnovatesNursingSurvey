import * as React from 'react';
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
import './DashboardHome.css'
const DashboardHome = () => {

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
            {[1, 2, 3].map((item) => (
                  <ListItem key={`item-${item}`}>
                    
                    <Button size="small" sx={{color:"black", size:"5px"}} href={`#${item}`}><ListItemText primary={`Week ${item}`} /></Button>
                  </ListItem>
                ))}
          </ul>
          <ul>
            <ListSubheader>{"Daily Surveys"}</ListSubheader>
            {[0, 1, 2].map((item) => (
                  <ListItem key={`item-${item}`}>
                    <Button size="small" sx={{color:"black"}} href="#text-buttons"><ListItemText primary={`07-2${item}-2022`} /></Button>
                  </ListItem>
                ))}
          </ul>
          
        </List>
      </Box>
    </>
  );
};
export default DashboardHome;