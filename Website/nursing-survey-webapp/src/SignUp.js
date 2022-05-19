import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import './SignUp.css'

const Form = ({ handleClose }) => {
  
  // create state variables for each input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log(firstName, lastName, email, password);
    handleClose();
  };


  
  return (
    <>
    <div className="UIBox"></div>
    <Typography variant="h4" component="div" gutterBottom className="SignUpHeader" sx={{ml: 3, mt: 3}}>
      Sign Up
    </Typography>
    <form className="SignUp" onSubmit={handleSubmit}>
    
    <TextField
      label="First Name"
      variant="standard"
      required
      value={firstName}
      placeholder="e.g. Jane"
      InputProps={{
        startAdornment: ( 
          <InputAdornment position="start">
            <PersonIcon />
          </InputAdornment>
        ),
      }}
      onChange={e => setFirstName(e.target.value)}
    />
    
    
    <TextField
      label="Last Name"
      variant="standard"
      required
      value={lastName}
      placeholder="e.g. Doe"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonIcon />
          </InputAdornment>
        ),
      }}
      onChange={e => setLastName(e.target.value)}
    />
    <TextField
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
      label="Password"
      variant="standard"
      type="password"
      required
      value={password}
      placeholder="e.g. jane.doe@example.com"
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