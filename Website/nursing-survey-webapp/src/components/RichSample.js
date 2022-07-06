import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import './RichSample.css';
import { useNavigate } from 'react-router-dom';

function RichSample(){
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
            navigate('/login')
        }
    });

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }
    return (
        <Grid container justify="center" sx={{justifyContent: 'center', mt: 2}}>
            <Box sx={{  alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column"}}>
                <Typography variant="h2" gutterBottom component="div">
                    June 16, 2022 Demo
                </Typography>
                <Stack spacing={3} direction="row" sx={{justifyContent: "center", minWidth: '70%'}}>
                    {/* <Button component={Link} to="/login" variant="contained" color="primary">
                        Login
                    </Button> */}
                    <Button variant="contained" onClick={(e) => logout()} color="primary">
                        Logout
                    </Button>
                    {/* <Button component={Link} to="/signup" variant="contained" color="primary">
                        Sign Up
                    </Button> */}
                </Stack>
                <Stack spacing={3} direction="row" sx={{justifyContent: "center", minWidth: '70%', mt:2}}>

                    <Button component={Link} to="/survey/1" variant="contained" color="primary" OnClick="window.location.reload();">
                        Daily Survey
                    </Button>
                    <Button component={Link} to="/survey/2" variant="contained" color="primary" OnClick="window.location.reload();">
                        Weekly Survey
                    </Button>
                </Stack>
            </Box>
        </Grid>
        
    );
}

export default RichSample;