import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import SignUp from './components/SignUp.js';
import Login from './components/Login.js';
import ForgotPassword from './components/ForgotPassword.js';
import Survey from './components/Survey';
import RichSample from './components/RichSample.js';
import Profile from './components/Profile.js';
import UserStats from './components/UserStats.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<RichSample/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/survey/:surveyType" element={<Survey />} />
            
          <Route path="/signup" element={<SignUp />} />
            
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/stats" element={<UserStats />} />
        </Routes>
      <App />
      
    </BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
