import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import SignUp from './components/SignUp.js';
import Login from './components/Login.js';
import ForgotPassword from './components/ForgotPassword.js';
import Dashboard from "./components/Dashboard";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>

        <Route path="/" element={<Login />} />
          
        <Route path="/signup" element={<SignUp />} />
          
        <Route path="/forgot" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
          
      </Routes>
    <App />
    
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
