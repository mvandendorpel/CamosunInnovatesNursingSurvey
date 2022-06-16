//import 'dotenv/config.js';
import db from './models/index.mjs';
import express, { application } from 'express'; 
import cookieParser from 'cookie-parser'; 
import compression from 'compression'; 
import morgan from 'morgan'; 
import cors from 'cors'; 
import apiRouter from './routers/api-router.mjs';
import rateLimit from 'express-rate-limit';
import passport from 'passport';

// const dotenv = require('dotenv/config.js');
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const compression = require('compression');
// const morgan = require('morgan');
// const cors = require('cors');
// const apiRouter = require('./routers/api-router.mjs');
// const rateLimit = require('express-rate-limit');
// const passport = require('passport');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(compression());
app.use(morgan('dev')); 
app.use(cors()); 
app.use(rateLimit());
app.use(passport.initialize());


//var allowlist = ['http://localhost:3000']


// db.sequelize.sync().then(() => {
//     console.log('connected');
// })

// const nurse = await Nurses.create({
//     FirstName: "test",
//     LastName: "test",
//     email: "test@gmail.com",
//     Password: "test123",
//     username: "test1233"
// });
// console.log('nurse', nurse);



app.get('/', (req, res) => {
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    res.send("Node.js server is live");
    next();
})




app.use('/api', apiRouter);

export default app;