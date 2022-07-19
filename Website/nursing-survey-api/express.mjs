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
import {getIntervalData} from './controllers/fb-api-controller.mjs';
import { Fitbit } from './models/fitbit.mjs';
import sequelize from 'sequelize';

dotenv.config();
const scope = 'activity heartrate location nutrition profile settings sleep weight'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(compression());
app.use(morgan('dev')); 
app.use(cors()); 
//app.use(rateLimit());
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
    res.redirect(client.getAuthorizeUrl(scope, `https://10.51.253.2:3004/fb`,[],req.query.surveyId));
})

app.get('/fb', async (req, res) => {
    try {
        if (req.body.newUser) {
            // client.getAccessToken(req.query.code, 'https://10.51.253.2:3004/fb').then(result => {
            //     client.get("/profile.json", result.access_token).then(results => {
            //         res.send(results[0]);
            //     }).catch(err => {
            //         res.status(err.status).send(err);
            //         console.log(err);
            //     })
        // })
    }
    else {
        let survey_ID = req.query.state;
        let collectedData = [];
        var stepIntervalData, HRIntervalData, sleepData;
        var stepData, HRData;
        const surveyQuery = `SELECT surveyDate, nurses_ID FROM survey WHERE Id = ${survey_ID}`;
        const queryResult = await db.sequelize.query(surveyQuery, {type: sequelize.QueryTypes.SELECT});
        let date = queryResult[0].surveyDate;
        /*const auth_data =  await client.getAccessToken(req.query.code, `https://10.51.253.2:3004/fb`,[],req.body.user);
        const access_token = auth_data.access_token;
        console.log('access_token', access_token);

        const stepDataResp =  await client.get(`/activities/steps/date/${date}/1d/15min.json`, access_token);
        stepData = stepDataResp[0];
        stepIntervalData = await getIntervalData(stepDataResp[0]['activities-steps-intraday'].dataset);
        console.log('stepDataResp', stepDataResp);

        const HRDataResp = await client.get(`/activities/heart/date/${date}/1d/1min.json`, access_token);
        HRData = HRDataResp[0];
        HRIntervalData = await getIntervalData(HRDataResp[0]['activities-heart-intraday'].dataset);
        console.log('HRDataResp', HRDataResp);

        const sleepDataResp = await client.get(`/sleep/date/today.json`, access_token);
        sleepData = sleepDataResp[0];
        console.log('sleepDataResp', sleepDataResp);*/
        await client.getAccessToken(req.query.code, `https://10.51.253.2:3004/fb`,[],req.body.user).then(async result => {
            client.get(`/activities/steps/date/${date}/1d/15min.json`, result.access_token).then(async results => {
                stepData = results[0];
                stepIntervalData = await getIntervalData(results[0]['activities-steps-intraday'].dataset);
                
                //res.status(200).send(results[0]);
                
            }).catch(err => {
                res.status(500).send(err);
                console.log(err);
            })
            await client.get(`/activities/heart/date/${date}/1d/1min.json`, result.access_token).then(async results => {
                HRData = results[0];
                HRIntervalData = await getIntervalData(results[0]['activities-heart-intraday'].dataset);
                //res.status(200).send(results[0]);
            }).catch(err => {
                res.status(500).send(err);
                console.log(err);
            })
            await client.get(`/sleep/date/today.json`, result.access_token).then(async results => {
                sleepData = results[0];
                //res.status(200).send(results[0]);
            }).catch(err => {
                res.status(500).send(err);
                console.log(err);
            })
        });
        console.log("Interval Data: " + JSON.stringify(sleepData));
        const step_activity_all = stepIntervalData[0];
        const step_activity_shift = stepIntervalData[1];
        const step_activity_postshift = stepIntervalData[2];
        const step_activity_preshift = stepIntervalData[3];
        const hr_activity_all = HRIntervalData[0];
        const hr_activity_shift = HRIntervalData[1];
        const hr_activity_postshift = HRIntervalData[2];
        const hr_activity_preshift = HRIntervalData[3];
        const nurses_ID = queryResult[0].nurses_ID;
        const sleep = sleepData;
        
        const fitbit = await Fitbit.create({
            nurses_ID,
            date,
            step_activity_all,
            step_activity_shift,
            step_activity_preshift,
            step_activity_postshift,
            hr_activity_all,
            hr_activity_shift,
            hr_activity_preshift,
            hr_activity_postshift,
            sleep,
            survey_ID
        });

        // const fitbit = await Fitbit.create({
        //     nurses_ID,
        //     date,
        //     step_activity_all,
        //     step_activity_shift,
        //     step_activity_preshift,
        //     step_activity_postshift,
        //     hr_activity_all,
        //     hr_activity_shift,
        //     hr_activity_preshift,
        //     hr_activity_postshift,
        //     sleep,
        //     survey_ID
        // });
       // res.status(200).send(collectedData);
        res.redirect('https://10.51.253.2:3000');
        //res.send(collectedData);
    }
}
catch(err) {
    res.status(401).send(err);
    console.log(err);
}
})



app.use('/api', apiRouter);

export default app;