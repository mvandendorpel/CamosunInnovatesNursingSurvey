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

dotenv.config();

//Represents the amount of time(in hours) to collect before and after the user's work shift
const PREWORK_PERIOD = 2;
const POSTWORK_PERIOD = 2;

const client = new FitbitApiClient({
    clientId: `${process.env.FB_OAUTH_ID}`,
    clientSecret: `${process.env.FB_CLIENT_SECRET}`,
    apiVersion: "1.2"
})


/**
 * Function takes in data in JSON format, and then attempts to parse out the data that is recorded 
 * 1. During the user's recorded shift(if one is found)
 * 2. The prework period set above
 * 3. the postwork period set above
 * @param  {} activityData --JSON data from Fitbit API Endpoint
 * @param  {} metric --String representing the metric that activityData represents.  ex. "steps", "heartrate"
 */
const getIntervalData = (activityData, metric) => {
    const query = '' //TODO: Query to get shift data

    const result = db.sequelize.query(query);

    let startTime = new Date(result.shiftStart);
    let startTimeMinutes = startTime.getMinutes();
    let startTimeHour = startTime.getHours();

    let endTime = new Date(result.shiftStart);
    let endTimeHour = endTime.getHours();
    let endTimeMinutes = endTime.getMinutes();

    let workActivity = activityData.activities-steps-intraday.dataset.filter(function (entry) {
        let entryTime = new Date("1970-01-01 " + entry.time);
        let entryHour = entryTime.getHours();
        let entryMinutes = entryTime.getMinutes();

        if ((entryHour >= startTimeHour && entryHour <= endTimeHour) && (entryMinutes >= startTimeMintues && entryMinutes <= endTimeHour)) {
            return entry;
        }
    });
    console.log(workActivity);

    let preWorkActivity = activityData.activities-steps-intraday.dataset.filter(function (entry) {
        let entryTime = new Date("1970-01-01 " + entry.time);
        let entryHour = entryTime.getHours();
        let entryMinutes = entryTime.getMinutes();

        if ((entryHour  >= startTimeHour - PREWORK_PERIOD && entryHour <= startTimeHour) && (entryMinutes >= startTimeMintues && entryMinutes <= endTimeHour)) {
            return entry;
        }
    })
    console.log(preWorkActivity);
    let postWorkActivity = activityData.activities-steps-intraday.dataset.filter(function (entry) {
        let entryTime = new Date("1970-01-01 " + entry.time);
        let entryHour = entryTime.getHours();
        let entryMinutes = entryTime.getMinutes();

        if ((entryHour >= endTimeHour && entryHour <= endTimeHour + POSTWORK_PERIOD) && (entryMinutes >= startTimeMintues && entryMinutes <= endTimeHour)) {
            return entry;
        }
    })
    console.log(postWorkActivity);

    //TODO: Query(ies) to input the data into the DB

}

                
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