import passport from 'passport';
import LocalStrategy from 'passport-local';
import jwt from 'jsonwebtoken';
import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import argon2 from 'argon2';
import mysql from 'mysql';
import axios from 'axios';
import dotenv from 'dotenv';
import FitbitApiClient from "fitbit-node";
import db from '../models/index.mjs';
import { Fitbit } from '../models/fitbit.mjs';

dotenv.config();

//Represents the amount of time(in hours) to collect before and after the user's work shift
const PREWORK_PERIOD = 120;
const POSTWORK_PERIOD = 120;

const client = new FitbitApiClient({
    clientId: `${process.env.FB_OAUTH_ID}`,
    clientSecret: `${process.env.FB_CLIENT_SECRET}`,
    apiVersion: "1.2"
})

const getStepData = async (req, res) => {
    try {
        const stepQuery = `SELECT step_activity_all from fitbitdata WHERE nurses_ID = ${req.query.nurses_id} ORDER BY date DESC`;
        const [results, metadata] = await db.sequelize.query(stepQuery);
        let stepCount = 0;
        const stepTotalMap = await results.map((element) => {
            console.log(element.step_activity_all['activities-steps'][0].value);
            stepCount += parseInt(element.step_activity_all['activities-steps'][0].value);
        })
        //console.log(stepCount);
        let stepAvg = Math.round(((stepCount / results.length) + Number.EPSILON) * 100) / 100

        //console.log(stepAvg);
        const todaySteps = results[0]?.step_activity_all['activities-steps'][0].value;
        //console.log(todaySteps);
        const response = {
            "totalSteps": stepCount,
            "avgSteps": stepAvg,
            "todaySteps": todaySteps
        };
        res.status(200).send(response);
    }
    catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
}


/**
 * Function takes in data in JSON format, and then attempts to parse out the data that is recorded 
 * 1. During the user's recorded shift(if one is found)
 * 2. The prework period set above
 * 3. the postwork period set above
 * @param  {} activityData --JSON data from Fitbit API Endpoint
 */
const getIntervalData = async (activityData) => {
    //const query = 'SELECT * FROM shiftdata' //TODO: Query to get shift data

    //const result = db.sequelize.query(query);

    let startTime = new Date();
    startTime.setHours(startTime.getHours() - 8);
    let startTimeMinutes = startTime.getMinutes();
    let startTimeHour = startTime.getHours();
    let startTimeCheck = startTimeHour * 60 + startTimeMinutes;

    let endTime = new Date();
    endTime.setHours(endTime.getHours() - 6);
    let endTimeHour = endTime.getHours();
    let endTimeMinutes = endTime.getMinutes();
    let endTimeCheck = endTimeHour * 60 + endTimeMinutes;

    // Gather Activity Data(Steps)
    
    let workActivity = await activityData.filter(function (entry) {
        let entryTime = new Date("1970-01-01 " + entry.time);
        let entryHour = entryTime.getHours();
        let entryMinutes = entryTime.getMinutes();
        let entryCheck = entryHour * 60 + entryMinutes;

        if ((entryCheck >= startTimeCheck) && (entryCheck <= endTimeCheck)) {
            //console.log(entry);
            return entry;
        }
    });
    console.log(workActivity);

    let preWorkActivity = await activityData.filter(function (entry) {
        let entryTime = new Date("1970-01-01 " + entry.time);
        let entryHour = entryTime.getHours();
        let entryMinutes = entryTime.getMinutes();
        let entryCheck = entryHour * 60 + entryMinutes;

        if ((entryCheck >= startTimeCheck - PREWORK_PERIOD) && (entryCheck <= startTimeCheck)) {
            //console.log(entry);
            return entry;
        }
    })
    console.log(preWorkActivity);
    let postWorkActivity = await activityData.filter(function (entry) {
        let entryTime = new Date("1970-01-01 " + entry.time);
        let entryHour = entryTime.getHours();
        let entryMinutes = entryTime.getMinutes();
        let entryCheck = entryHour * 60 + entryMinutes;

        if ((entryCheck >= endTimeCheck) && (entryCheck <= endTimeCheck + POSTWORK_PERIOD)) {
            //console.log(entry);
            return entry;
        }
    })
    console.log(postWorkActivity);

    return [activityData, workActivity, preWorkActivity, postWorkActivity];
    //TODO: Query(ies) to input the data into the DB

        // const {
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
        // } = req.body;

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
    

     //pulling fitbitdata
     const queryFitbit = 'SELECT * FROM fitbitdata' //TODO: Query to get shift data

     const fitbitResult = db.sequelize.query(queryFitbit);


}
export {getIntervalData, getStepData};
                
// function checkTime() {
//     var d = new Date(); // current time
//     var hours = d.getHours();
//     var mins = d.getMinutes();
//     var day = d.getDay();

//     return day >= 1
//         && day <= 5
//         && hours >= 9 
//         && (hours < 17 || hours === 17 && mins <= 30);
// }