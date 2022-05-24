import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import './SignUp.css'

const Form = ({ handleClose }) => {
  
  // create state variables for each input
  const [username, setUsername] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, email, password);
    try { 
      await axios.post('http://localhost:3004/api/users',{
        email: email,
        username: username,
        password: password
      });
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <>
    <IconButton aria-label="close" size="large" className="CloseButton" href="/login" sx={{color: 'white'}}>
      <CloseIcon className="CloseButton" />
    </IconButton>
    <div className="UIBox"></div>
    <Typography variant="h4" component="div" gutterBottom className="SignUpHeader" sx={{ml: 3, mt: 3}}>
      Sign Up
    </Typography>
    <form className="SignUp" onSubmit={handleSubmit}>
    
      <TextField //Username Text Field
        margin="normal"
        label="Username"
        variant="standard"
        required
        value={username}
        placeholder="e.g. janedoe"
        InputProps={{
          startAdornment: ( 
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
        onChange={e => setUsername(e.target.value)}
      />
      
      
      <TextField
        margin="normal"
        label="Email"
        variant="standard"
        type="email"
        required
        value={email}
        placeholder="e.g. jane.doe@example.com"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailIcon />
            </InputAdornment>
          ),
        }}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        label="Password"
        variant="standard"
        type="password"
        required
        value={password}
        placeholder="********"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon  />
            </InputAdornment>
          ),
        }}
        onChange={e => setPassword(e.target.value)}
      />
      <div className="SubmitButton">
        {/* <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button> */}
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
        
      </div>
  </form></>
    
  );
};



export default Form;