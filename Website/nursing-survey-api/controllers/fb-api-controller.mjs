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

//WAS ORIGINALLY BUILT AS CONTROLLER FOR GATHERING DATA FROM FITBIT API, BUT COULD NOT GET THE API CALLS TO WORK IN HERE.  ANY MANIPULATION OF DATA FROM FITBIT API, OR OUR API TO THAT DATA, SHOULD BE DONE HERE.

dotenv.config();

//Represents the amount of time(in minutes) to collect before and after the user's work shift
const PREWORK_PERIOD = 120;
const POSTWORK_PERIOD = 120;

const client = new FitbitApiClient({
    clientId: `${process.env.FB_OAUTH_ID}`,
    clientSecret: `${process.env.FB_CLIENT_SECRET}`,
    apiVersion: "1.2"
})
/**
 * Returns step data for the Steps page in user profile.  Returns total steps, avg steps, and the number of steps for the last dataset found.
 * @param  {} req.query.nurses_id

 */
const getStepData = async (req, res) => {
    try {
        // const stepQuery = `SELECT step_activity_all from fitbitdata WHERE nurses_ID = ${req.query.nurses_id} ORDER BY date DESC`;
        // const [results, metadata] = await db.sequelize.query(stepQuery);
        const results = await Fitbit.findAll({
            where: {
                nurses_ID: req.query.nurses_id
            },
            order: [
                ['date', 'DESC']
            ]
        })

        let stepCount = 0;
        console.log(results)
        const stepTotalMap = results.map((element) => {
            
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
        console.log(response)
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
    //console.log(workActivity);

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
    //console.log(preWorkActivity);
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
    //console.log(postWorkActivity);

    return [activityData, workActivity, preWorkActivity, postWorkActivity];

}
export {getIntervalData, getStepData};
                