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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(firstName, lastName, email, password);
    try { 
      await axios.post('https://10.51.253.2:3004/api/users',{
        email: email,
        username: userName, //TODO: FIX THIS
        password: password,
        firstName: firstName,
        lastName: lastName
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
    
      <TextField //First Name Text Field
        margin="normal"
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
      
      <TextField //Last Name Text Field
        margin="normal" 
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
      <TextField //Email text field
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

<TextField //User Name Text Field
        margin="normal" 
        label="Username"
        variant="standard"
        required
        value={userName}
        placeholder="e"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
        onChange={e => setUserName(e.target.value)}
      />
      
      <TextField //password text field
        margin="normal"
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
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>  
      </div>
  </form></>
    
  );
};



export default Form;