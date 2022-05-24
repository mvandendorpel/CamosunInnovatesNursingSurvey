import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import axios from 'axios';
import './SignUp.css'

const Form = ({ handleClose }) => {
  
  // create state variables for each input

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      await axios.post('http://localhost:3004/api/login', {
        username: username,
        password: password
      });
    } catch (e) {
      console.log(e);
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
          label="Username"
          variant="standard"
          type="text"
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