import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import './SignUp.css'

const Form = ({ handleClose }) => {
  
  // create state variables for each input

  const [email, setEmail] = useState('');


  const handleSubmit = e => {
    e.preventDefault();
    console.log(email);
    handleClose();
  };

  return (
    <>
      <IconButton aria-label="close" size="large" className="CloseButton" href="/login" sx={{color: 'white'}}>
        <CloseIcon className="CloseButton" />
      </IconButton>
      <div className="UIBox"></div>
      <Typography variant="h4" component="div" gutterBottom className="SignUpHeader" sx={{ml: 3, mt: 3}}>
        Forgot Password
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
      
      <div className="SubmitButton">
        {/* <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button> */}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        
      </div>
    </form>
    </>
    
  );
};



export default Form;