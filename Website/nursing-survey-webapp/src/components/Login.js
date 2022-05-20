import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import './SignUp.css'

const Form = ({ handleClose }) => {
  
  // create state variables for each input

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/login', {
          email: email,
          password: password
      });
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
          setMsg(error.response.data.msg);
      }
    }
  };


  
  return (
    <React.Fragment>
    
    <div className="UIBox"></div>
    <Typography variant="h4" component="div" gutterBottom className="SignUpHeader" sx={{ml: 3, mt: 3}}>
      Login
    </Typography>
    <form className="SignUp" onSubmit={handleSubmit}>
    
    
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
      helperText={<Link href="/forgot" variant="body2" underline="none" >
        {'Forgot your password?'}
      </Link>}
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
      <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} >
        Log In
      </Button>
      <Button variant="text" href="/signup">Sign Up</Button>
    </div>
  </form>
  </React.Fragment>
    
  );
};



export default Form;