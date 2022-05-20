import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './SignUp.css'

const Form = ({ handleClose }) => {
  
  // create state variables for each input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [confPassword, setConfPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(firstName, lastName, email, password);
    try { 
      await axios.post('http://localhost:5000/users', { 
        fname: firstName,
        lname: lastName,
        email: email,
        password: password
        //confPassword: confPassword

      });
      navigate("/");
    } catch (e) {
      if (e.response) {
        setMsg(e.response.data.msg);
      }
    }
    //handleClose();
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
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
          Sign Up
        </Button>
        
      </div>
  </form></>
    
  );
};



export default Form;