import React, { useEffect, useState } from 'react';
import HeaderImage from './header-image.svg';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import axios from 'axios';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useNavigate } from 'react-router-dom';



import './SurveyHeader.css'

function stringToColor(string) { 
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}

function stringAvatar(name) {
  
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const SurveyHeader = (props) => {
  const navigate = useNavigate();
  const authToken = window.localStorage.getItem('authToken'); // retrieves the saved token from localstorage
  const decoded = jwtDecode(authToken); 
  const userID = decoded.userID  
  const [data, setData] = useState([]);
  const apiURL = "https://10.51.253.2:3004/api/users";
  const getUserInfo = async () => {
    try {
        const userData = await axios.get(`${apiURL}?nurses_id=${userID}`);
        setData(userData.data[0]);
        
    } catch (e) {
        console.log(e);
    }
  }

  useEffect(() => {
    getUserInfo();
    console.log(`${data.firstName} ${data.lastName}`);
  }, []); 

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  }
  
  return (
    <React.Fragment>
      
      <Typography className="survey-header" variant="h4" component="div" gutterBottom sx={{ml: 4.5, mt: 6, color: "white"}}>
      <IconButton sx={{width: "unset", color:"white", padding:"0 20px 5px 0"}} component={Link} to="/">
            <HomeIcon sx={{width:"1.5em", height:"1.5em"}}/>
          </IconButton>
        {props.title}         
        <Tooltip title="Account settings"> 
          <IconButton
            sx={{width: "56px"}}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined} onClick={handleClick} className="profile-pic" aria-label="profile">
            <Avatar {...stringAvatar(`${data.firstName} ${data.lastName}`)} />
          </IconButton>
          
        </Tooltip>
      </Typography>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
            },
            '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
            },
        },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem button component={Link} to="/profile">
          Profile 
          
        </MenuItem>
        <MenuItem onClick={() => alert("Not Currently Functional")}>
          My account
        </MenuItem>
    
        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        
      </Menu>
      <img src={HeaderImage} alt="header"/>
      
    </React.Fragment>
  );
}

export default SurveyHeader;