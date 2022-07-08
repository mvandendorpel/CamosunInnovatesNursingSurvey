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
import FitbitApiClient from "fitbit-node";
import dotenv from 'dotenv';
import mergeJSON from 'merge-json';

dotenv.config;
const scope = 'activity heartrate location nutrition profile settings sleep weight'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(compression());
app.use(morgan('dev')); 
app.use(cors()); 
app.use(rateLimit());
app.use(passport.initialize());



const client = new FitbitApiClient({
    clientId: `${process.env.FB_OAUTH_ID}`,
    clientSecret: `${process.env.FB_CLIENT_SECRET}`,
    apiVersion: "1.2"
})

//var allowlist = ['http://localhost:3000']


// db.sequelize.sync().then(() => {
//     console.log('connected');
// })

// const nurse = await Nurses.create({
//     FirstName: "test",
//     LastName: "test",
//     email: "test@gmail.com",
//     Password: "test123",
//     username: "test1233"12345
// });
// console.log('nurse', nurse);


app.get('/', (req, res) => {
    res.send("Node.js server is live");
})

app.get('/authorize', (req, res) => {
    res.redirect(client.getAuthorizeUrl(scope, 'https://10.51.253.2:3004/fb'));
})

app.get('/fb', (req, res) => {
    try {
        if (req.body.newUser) {
            client.getAccessToken(req.query.code, 'https://10.51.253.2:3004/fb').then(result => {
                client.get("/profile.json", result.access_token).then(results => {
                    res.send(results[0]);
                }).catch(err => {
                    res.status(err.status).send(err);
                    console.log(err);
                })
        })
    }
    else {
        let date = '2022-07-06';
        let collectedData = [];
        client.getAccessToken(req.query.code, 'https://10.51.253.2:3004/fb').then(result => {
            client.get(`/activities/steps/date/${date}/1d/15min.json`, result.access_token).then(results => {

                
                res.status(200).send(results[0]);
                
            }).catch(err => {
                //res.status(500).send(err);
                console.log(err);
            })
            client.get(`/activities/heart/date/${date}/1d/1min.json`, result.access_token).then(results => {
                //res.status(200).send(results[0]);
            }).catch(err => {
                //res.status(500).send(err);
                console.log(err);
            })
            client.get(`/sleep/date/today.json`, result.access_token).then(results => {
                //res.status(200).send(results[0]);
            }).catch(err => {
                res.status(500).send(err);
                console.log(err);
            })
        })
       // res.status(200).send(collectedData);
        console.log(collectedData);
        //res.send(collectedData);
    }
}
catch(err) {
    res.status(409).send(err);
    console.log(err);
}
})



app.use('/api', apiRouter);

export default app;