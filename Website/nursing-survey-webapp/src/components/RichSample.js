import React from 'react';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import './RichSample.css';

function RichSample(){
    return (
        <Grid container justify="center" sx={{justifyContent: 'center', mt: 2}}>
            <Box sx={{  alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column"}}>
                <Typography variant="h2" gutterBottom component="div">
                    June 16, 2022 Demo
                </Typography>
                <Stack spacing={3} direction="row" sx={{justifyContent: "center", minWidth: '70%'}}>
                    <Button component={Link} to="/login" variant="contained" color="primary">
                        Login
                    </Button>
                    <Button component={Link} to="/signup" variant="contained" color="primary">
                        Sign Up
                    </Button>
                </Stack>
                <Stack spacing={3} direction="row" sx={{justifyContent: "center", minWidth: '70%', mt:2}}>

                    <Button component={Link} to="/survey/1" variant="contained" color="primary" onClick="window.location.reload();">
                        Daily Survey
                    </Button>
                    <Button component={Link} to="/survey/2" variant="contained" color="primary" onClick="window.location.reload();">
                        Weekly Survey
                    </Button>
                </Stack>
            </Box>
        </Grid>
        
    );
}

export default RichSample;