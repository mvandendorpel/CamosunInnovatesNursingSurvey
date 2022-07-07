import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import SurveyHeader from './SurveyHeader';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Divider from '@mui/material/Divider';
const Profile = () => {
    const title = 'My Profile';
    return(
        <>
            <SurveyHeader title={ title} />
            <List>
            <ListItem button component={Link} to="/profile/steps" secondaryAction={
                <IconButton edge="end" aria-label="navigate">
                    <ArrowForwardIosIcon />
                </IconButton>
                }>
                <ListItemText primary={"My Steps"} />
            </ListItem>
            <Divider variant="middle" component="li" />
            <ListItem button component={Link} to="/profile/stats" secondaryAction={
                <IconButton edge="end" aria-label="navigate">
                    <ArrowForwardIosIcon />
                </IconButton>
                }>
                <ListItemText primary={"My Stats"} />
            </ListItem>
            <Divider variant="middle" component="li" />
            <ListItem button component={Link} to="/profile/submissions" secondaryAction={
                <IconButton edge="end" aria-label="navigate">
                    <ArrowForwardIosIcon />
                </IconButton>
                }>
                <ListItemText primary={"My Submissions"} />
            </ListItem>
        </List>
      </>
    );
    
}

export default Profile;