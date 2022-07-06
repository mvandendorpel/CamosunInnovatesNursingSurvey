import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import axios from 'axios';
import './SignUp.css'
import { useNavigate } from 'react-router-dom';

const Form = ({ handleClose }) => {
  
  // create state variables for each input

  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      const authToken = await axios.post('https://10.51.253.2:3004/api/login', {
        username: username,
        password: password
      });
      if (authToken) {
        localStorage.setItem('authToken', authToken.data.token);
        navigate('/');
      }
    } catch (e) {
      console.log(e);
      alert('Incorrect email or password!')
    }
  };

  
  return (
    <React.Fragment>
    
      <div className="UIBox"></div>
      <Typography variant="h4" component="div" gutterBottom className="SignUpHeader" sx={{ml: 3, mt: 3}}>
        Login
      </Typography>
      <form className="SignUp" onSubmit={handleSubmit}>
    
    <TextField //Email text field
      margin="normal"
      label="Email"
      variant="standard"
      type="text"
      required
      value={username}
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
    
    <TextField //password text field
      margin="normal"
      label="Password"
      variant="standard"
      type="password"
      required
      value={password}
      placeholder="e.g. jane.doe@example.com"
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
      <Button type="submit" variant="contained" color="primary">
        Log In
      </Button>
      <Button variant="text" href="/signup">Sign Up</Button>
    </div>
  </form>
  </React.Fragment>
    
  );
};



export default Form;