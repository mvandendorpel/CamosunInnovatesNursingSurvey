import db from '../models/index.mjs';
import xlsx from 'json-as-xlsx';
import XLSX from 'xlsx';
import { Fitbit } from '../models/fitbit.mjs';
import { Sequelize } from 'sequelize';
import { decrypt, encrypt } from '../util.js';
import { UserProfile } from '../models/userProfile.mjs';

//THIS CONTROLLER WAS BUILT FOR THE ENDPOINTS NEEDED BY RESEARCHERS.  THE ENDPOINTS HERE WILL GENERATE .XLSX FILES FOR THE RESEARCHERS TO ANALYZE.
// All Endpoints will be expecting:
//  - periodStart and periodEnd - Dates in YYYY-MM-DD format
//  - nurses_id

/**
 * This will "flatten" JSON data into a single array.  Has limited use, but kept here in case it's wanted later.
 * @param  {} obj JSON data that is multi-dimensional
 */
export const flattenObject = (obj) => {
    const flattened = {}
  
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
  
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value))
      } else {
        flattened[key] = value
      }
    })
  
    return flattened
}
/**
 * Will create an array of dates between two periods.
 * @param  {} periodStart
 * @param  {} periodEnd

 */
const getSurveyPeriod = async (periodStart, periodEnd) => {
    let surveyDateCheck = new Date(periodEnd);
    const periodCheckStart = new Date(periodStart);
    let dailySurveyPeriod = [];
    dailySurveyPeriod.push(`${surveyDateCheck.getFullYear()}-${('0' + (surveyDateCheck.getMonth()+1)).slice(-2)}-${('0' + (surveyDateCheck.getDate() + 1)).slice(-2)}`);
    for (surveyDateCheck; surveyDateCheck >= periodCheckStart; surveyDateCheck.setDate(surveyDateCheck.getDate() - 1)) {
        dailySurveyPeriod.push(`${surveyDateCheck.getFullYear()}-${('0' + (surveyDateCheck.getMonth()+1)).slice(-2)}-${('0' + surveyDateCheck.getDate()).slice(-2)}`);
    }
    return dailySurveyPeriod;
}
/**
 * Returns user information.
 * @param  {} nurses_ID

 */
const getUserInfo = async (nurses_ID) => {
    var  query = `SELECT user.ID, user.username, user_info.firstName, user_info.lastName, user_info.dateOfBirth, user_info.city, user_info.gender FROM user INNER JOIN user_info ON user.id = user_info.userID where user.id = ${nurses_ID};`
    const results = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT
    });
    return results;
}
/**
 * returns Fitbit data found for a nurse over a period of dates
 * @param  {} nurses_ID
 * @param  {} dateRange - Array of dates - typically obtained from getSurveyPeriod

 */
const getFitbitData = async (nurses_ID, dateRange) => {
    const fbResults = await Fitbit.findAll({
        where: {
          nurses_ID: nurses_ID,
          date: {
            [Sequelize.Op.in]: dateRange
      }
        }
      })
      return fbResults;
}

/**
 * converts the 15 minute increments into 1 hour increments
 * @param  {} stepData - Fitbit step data in 15 minute intervals(INTERDAY)
 */
const getStepsByHours = 
 (stepData) => {
    let stepCountByHour = []
    let stepCount = 0;
    let stepTime = stepData[0].time;
    for (let i = 0; i < stepData.length; i++) {
        stepCount += stepData[i].value;
        if (i % 4 == 0 && i > 0) {
            stepCountByHour.push({
                "time": stepTime,
                "stepCount": stepCount
            });
            stepTime = stepData[i].time;
            stepCount = 0;
        }
    }
    return stepCountByHour;
}
/**
 * counts total number of steps over a period
 * @param  {} range - JSON stepdata from Fitbit table

 */
const getTotal = (range) => {
    let total = 0;

    range.map(element => {
        //console.log(`RANGE: ${JSON.stringify(element)}`);
        total += element.stepCount
    })
    return total;
}

const getAverage = (range) => {

    return Math.round(((getTotal(range) / range.length) + Number.EPSILON) * 100) / 100;
}
/**
 * @param  {} stepData
 * @param  {} threshold

 */
const getStepsAboveThreshold = 
 (stepData, threshold) => {
    //console.log(stepData)
    let newStepData = []
    for (let i = 0; i < stepData.length; i++) {
        //console.log(stepData[i].stepCount);
        if (stepData[i].stepCount >= threshold) {
            newStepData.push({
                "time": stepData[i].time,
                "stepCount": stepData[i].stepCount
            });
        }
    }
    //console.log(newStepData);
    return newStepData;
}

/**
 * Generates the Sleep Report Excel Sheet
 * @param  {} req.query Should contain periodStart and periodEnd(YYYY-MM-dd format) and nurses_id
 */
const sleepReport = async (req, res) => {
/*
This graph uses
-	Date and Time to bed. 
-	Date and Time to wake.

In addition to these metrics, I would like to add to this graph:
-	Shift start and shift end (if they worked that day)

This report would also contain:
-	Quality of sleep – Fitbit and subjective data from the daily survey
-	Activity level for the day – Fitbit
-	Morning HR - Fitbit

*/
    let dailySurveyPeriod = await getSurveyPeriod(req.query.periodStart, req.query.periodEnd);

    //console.log(dailySurveyPeriod);
    const query = `SELECT q.*, sa.answer, q.id, s.surveyDate, s.id as surveyID FROM mydb.survey s INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id
    INNER JOIN question q ON q.id = sq.Question_Id
    INNER JOIN surveyanswer sa ON sq.id=sa.survey_question_id 
    WHERE s.nurses_ID = ${req.query.nurses_id} AND  s.surveyDate in (:dailySurveyPeriod) AND s.survey_type_id = 1`;
    const userData = await getUserInfo(req.query.nurses_id);
    console.log(userData);
    const surveyResults = await db.sequelize.query(query,{
        replacements: {dailySurveyPeriod},
        type: db.sequelize.QueryTypes.SELECT
    }
    ); 
    let surveyIDs = []
    for (var i in surveyResults) {

        surveyIDs.push(surveyResults[i].surveyID);
    }
    if (surveyIDs.length == 0) {
        res.status(200).send("No Survey Data Found");
        return;
    }
    const shiftQuery = `SELECT * from shiftdata WHERE survey_Id in (:surveyIDs)`;

    const shiftResults = await db.sequelize.query(shiftQuery, {
        replacements: {surveyIDs},
        type: db.sequelize.QueryTypes.SELECT
    })

    const fbResults = await getFitbitData(req.query.nurses_id, dailySurveyPeriod);



    //console.log('fbResults', fbResults);
    const fbFiltered = await fbResults.map(element => {
        let startTime, endTime
        let shiftStart, shiftEnd
        let heartRateAtShiftEnd, heartRateAtShiftStart
        for (var i in shiftResults) {
            //Get data on user's shift
            if (shiftResults[i].survey_Id == element.survey_ID) {
                startTime = new Date(decrypt(shiftResults[i].startTime));
                endTime = new Date(decrypt(shiftResults[i].endTime));
                shiftStart = `${startTime.getHours()}:${('0' + startTime.getMinutes()).slice(-2)}`;
                shiftEnd = `${endTime.getHours()}:${('0' + endTime.getMinutes()).slice(-2)}`;


                for (var k in element.hr_activity_all['activities-heart-intraday'].dataset) {
                    //Get heart Rate data
                    var intervalDate = new Date("1970-01-01 " + element.hr_activity_all['activities-heart-intraday'].dataset[k].time);
                    let timeCheck = intervalDate.getHours() * 60 + intervalDate.getMinutes();
                    let startTimeMinutes = startTime.getMinutes();
                    let startTimeHour = startTime.getHours();
                    let startTimeCheck = startTimeHour * 60 + startTimeMinutes;

                    let endTimeCheck = endTime.getHours() * 60 + endTime.getMinutes();

                    if (startTimeCheck == timeCheck) {
                        //console.log(`HEART RATE ${element.hr_activity_all['activities-heart-intraday'].dataset[k].value}`)
                        heartRateAtShiftStart = element.hr_activity_all['activities-heart-intraday'].dataset[k].value
                    }

                    if (endTimeCheck == timeCheck) {
                        heartRateAtShiftEnd =  element.hr_activity_all['activities-heart-intraday'].dataset[k].value;
                    }
                    
                }
                
            }
        }
        //console.log(`Sleep Data: ${JSON.stringify(element.sleep.sleep?.[0]?.dateOfSleep)}`);
        return {
            "date": element.date,
            "stepCount": element.step_activity_all['activities-steps'][0].value,
            "timeToWake": element.sleep.sleep?.[0]?.endTime ? element.sleep.sleep[0].endTime : "No Data",
            "timetoBed": element.sleep.sleep?.[0]?.startTime ? element.sleep.sleep[0].startTime : "No Data",
            "efficiency": element.sleep.sleep?.[0]?.efficiency ? element.sleep.sleep[0].efficiency : "No Data",
            "timeAsleep": element.sleep.sleep?.[0] ? element.sleep.sleep[0].minutesAsleep : "No Data",
            "shiftStart": shiftStart,
            "shiftEnd": shiftEnd,
            "hrStart": heartRateAtShiftStart,
            "hrEnd": heartRateAtShiftEnd
        }
    });
    //Formatting for spreadsheet.  See xlsx-to-json documentation and JS Sheets documentation
    let data = [
        {
        sheet: `Sleep Data for ${req.query.nurses_id}`,
        columns: [
            { label: "Date", value: (row) => (row.date)},
            { label: "Time to bed", value: (row) => (row.timeToBed ? row.timeToBed || "no data" : "2022-07-25T02:41:00.000") },
            { label: "Time to wake", value: (row) => (row.timeToBed ? row.timeToWake || "no data" : "2022-07-25T08:57:30.000") },
            { label: "Time asleep", value: (row) => (row.timeToBed ? row.timeAsleep || "no data" : "376") },
            { label: "Efficiency", value: (row) => (row.efficiency? row.efficiency || "no data" : "92") },
            { label: "Activity-Steps", value: (row) => (row.stepCount) },
            { label: "Shift Start", value: (row) => (row.shiftStart ? row.shiftStart || "no shift": "No work") },
            { label: "Shift End", value: (row) => (row.shiftEnd ? row.shiftEnd || "" : "No work")},
            { label: "Shift Start Heart Rate", value: (row) => (row.hrStart ? row.hrStart || "" : "no data")},
            { label: "Shift End Heart Rate", value: (row) => (row.hrEnd ? row.hrEnd || "" : "no data")}
            
        ],
        content: 
            fbFiltered
        
    }];

//Settings for spreadsheet file
    let settings = {
        fileName: "SleepDataTest", // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    }    
    
    res.status(200).send(fbResults);
    xlsx(data, settings); 
}
/**
 * Will generate a report of daily activity over a period.  This data is currently the largest to calculate and will generate several sheets per day:
 *  - User step data in 15 minute intervals
 *  - User heart rate in 1 minute intervals
 *  And will generate this data for each period:
 *  - The entire day
 *  - the user's shift
 *  - the Pre shift period
 *  - The post shift period
 * 
 * Will also return an overview sheet and a sheet containing all questions and answers to the daily surveys
 * @param  {} req
 */
const dailyReport = async (req, res) => {

    let surveyIDs = [];
    let dailySurveyPeriod = await getSurveyPeriod(req.query.periodStart, req.query.periodEnd);

    //Get survey questions/answers
    const query = `SELECT q.*, sa.answer, q.id, s.surveyDate, s.id as surveyID FROM mydb.survey s INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id
    INNER JOIN question q ON q.id = sq.Question_Id
    INNER JOIN surveyanswer sa ON sq.id=sa.survey_question_id 
    WHERE s.nurses_ID = ${req.query.nurses_id} AND  s.surveyDate in (:dailySurveyPeriod) AND s.survey_type_id = 1`;
    const surveyResults = await db.sequelize.query(query,{
        replacements: {dailySurveyPeriod},
        type: db.sequelize.QueryTypes.SELECT
    })
    //Get user info
    const userData = await getUserInfo(req.query.nurses_id);
    //console.log(userData);

    for (var i in surveyResults) {

        surveyIDs.push(surveyResults[i].surveyID);
    }
    //Gather user's shift data
    const shiftQuery = `SELECT * from shiftdata WHERE survey_Id in (:surveyIDs)`;
    const shiftResults = await db.sequelize.query(shiftQuery, {
        replacements: {surveyIDs},
        type: db.sequelize.QueryTypes.SELECT
    })
    //Get firbit data
    const fbResults = await getFitbitData(req.query.nurses_id, dailySurveyPeriod);
    //Clean survey data to just questions and answers
    const surveyData = surveyResults.map(element => {
        element.answer = decrypt(element.answer)
        let questionText = element.questionText;
        let answer = element.answer;
        let date = element.surveyDate;
        const data = {
            date,
            questionText,
            answer
        }
        return data;
    })
    //Remove heart rate data from fitibit results
    const heartRateData = await fbResults.map(element => {
        const date = { "date": element.date}

        let shiftHR = element.hr_activity_shift;
        let preShiftHR = element.hr_activity_preshift;
        let postShiftHR = element.hr_activity_postshift;

        const returnData = {
            "date": element.date,
            shiftHR,
            preShiftHR,
            postShiftHR
        }
        return returnData
    })
    //Remove step data(and compute it)
    const stepData = await fbResults.map( (element) => {
        const date = { "date": element.date };
        let fullDaySteps =  getStepsByHours(element.step_activity_all?.['activities-steps-intraday']?.dataset);
        fullDaySteps =  getStepsAboveThreshold(fullDaySteps, 10);
        console.log(`FULLDAYSTEPSFILTERED: ${JSON.stringify(fullDaySteps)}`);
        let shiftSteps =  getStepsByHours(element.step_activity_shift);
        
        shiftSteps =  getStepsAboveThreshold(shiftSteps, 10);
        console.log(shiftSteps);

        let preShiftSteps =  getStepsByHours(element.step_activity_preshift);
        preShiftSteps =  getStepsAboveThreshold(preShiftSteps, 10);

        let postShiftSteps =  getStepsByHours(element.step_activity_postshift);
        postShiftSteps =  getStepsAboveThreshold(postShiftSteps, 10);
        const returnData = {
            "date": element.date ,
            fullDaySteps,
            shiftSteps,
            preShiftSteps,
            postShiftSteps
        }
        
        return returnData;
    })

    const fbFiltered = await fbResults.map(element =>  {
        let startTime, endTime
        let shiftStart, shiftEnd
        let heartRateAtShiftEnd, heartRateAtShiftStart

        for (var i in shiftResults) { 
            if (shiftResults[i].survey_Id == element.survey_ID) {
                startTime = new Date(decrypt(shiftResults[i].startTime));
                endTime = new Date(decrypt(shiftResults[i].endTime));
                shiftStart = `${startTime.getHours()}:${('0' + startTime.getMinutes()).slice(-2)}`;
                shiftEnd = `${endTime.getHours()}:${('0' + endTime.getMinutes()).slice(-2)}`;

                for (var k in element.hr_activity_all['activities-heart-intraday'].dataset) {
                    var intervalDate = new Date("1970-01-01 " + element.hr_activity_all['activities-heart-intraday'].dataset[k].time);
                    let timeCheck = intervalDate.getHours() * 60 + intervalDate.getMinutes();
                    let startTimeMinutes = startTime.getMinutes();
                    let startTimeHour = startTime.getHours();
                    let startTimeCheck = startTimeHour * 60 + startTimeMinutes;

                    let endTimeCheck = endTime.getHours() * 60 + endTime.getMinutes();

                    if (startTimeCheck == timeCheck) {
                        //console.log(`HEART RATE ${element.hr_activity_all['activities-heart-intraday'].dataset[k].value}`)
                        heartRateAtShiftStart = element.hr_activity_all['activities-heart-intraday'].dataset[k].value
                    }

                    if (endTimeCheck == timeCheck) {
                        heartRateAtShiftEnd =  element.hr_activity_all['activities-heart-intraday'].dataset[k].value;
                    }
                    
                }
                
            }
        }

        const data = {
            "date": element.date,
            "stepCountTotal": element.step_activity_all['activities-steps'][0].value,
            "timeToWake": element.sleep.sleep?.[0]?.endTime ? element.sleep.sleep[0].endTime : "No Data",
            "timetoBed": element.sleep.sleep?.[0]?.startTime ? element.sleep.sleep[0].startTime : "No Data",
            "efficiency": element.sleep.sleep?.[0]?.efficiency ? element.sleep.sleep[0].efficiency : "No Data",
            "timeAsleep": element.sleep.sleep?.[0] ? element.sleep.sleep[0].minutesAsleep : "No Data",
            "shiftStart": shiftStart,
            "shiftEnd": shiftEnd,
            "hrStart": heartRateAtShiftStart,
            "hrEnd": heartRateAtShiftEnd,
        }
        //console.log(data.date);
        return data;
    });


    
    //json-to-xlsx is not used in this endpoint currently, the data is exported en mass through the XLSX module

    // let data = [
    //     {
    //         sheet: `Overview for ${req.query.nurses_id}`,
    //         columns: [
    //             { label: "Date", value: (row) => (row.date)},
    //             { label: "Shift Start", value: (row) => (row.shiftStart ? row.shiftStart || "no shift": "No work") },
    //             { label: "Shift End", value: (row) => (row.shiftEnd ? row.shiftEnd || "" : "No work")},
    //             { label: "Time to bed", value: (row) => (row.timeToBed ? row.timeToBed || "no data" : "2022-07-25T02:41:00.000") },
    //             { label: "Time to wake", value: (row) => (row.timeToBed ? row.timeToWake || "no data" : "2022-07-25T08:57:30.000") },
    //             { label: "Time asleep", value: (row) => (row.timeToBed ? row.timeAsleep || "no data" : "376") },
    //             { label: "Efficiency", value: (row) => (row.efficiency? row.efficiency || "no data" : "92") },
    //             { label: "Activity-Steps", value: (row) => (row.stepCount) },

    //             { label: "Shift Start Heart Rate", value: (row) => (row.hrStart ? row.hrStart || "" : "no data")},
    //             { label: "Shift End Heart Rate", value: (row) => (row.hrEnd ? row.hrEnd || "" : "no data")},
                
    //         ],
    //         content: 
    //             fbFiltered
            
    //     },
    //     {
    //         sheet: "Interval"
    //     }
    // ];


      
    //const stepSheet = XLSX.utils.json_to_sheet(filtered);
    const overviewSheet = XLSX.utils.json_to_sheet(fbFiltered);
    const surveySheet = XLSX.utils.json_to_sheet(surveyData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, overviewSheet, "Overview Data");
    XLSX.utils.book_append_sheet(workBook, surveySheet, "Survey Questions")

    //Flattens the heart rate data
    heartRateData.map(obj => {
        const {
            shiftHR,
            preShiftHR,
            postShiftHR,
            ...rest
        } = obj

        shiftHR.map(el => {
            rest[el['time']] = el.value
        })
        XLSX.utils.book_append_sheet(workBook, XLSX.utils.json_to_sheet(shiftHR), `Shift Heart Rate on ${obj.date}`);

        preShiftHR.map(el => {
            rest[el['time']] = el.value
        })
        XLSX.utils.book_append_sheet(workBook, XLSX.utils.json_to_sheet(preShiftHR), `Pre-Shift HR on ${obj.date}`);

        postShiftHR.map(el => {
            rest[el['time']] = el.value
        })
        XLSX.utils.book_append_sheet(workBook, XLSX.utils.json_to_sheet(postShiftHR), `Post-Shift HR on ${obj.date}`);
    })

    //Flattens the step data
    stepData.map(obj => {
        const {
            
            fullDaySteps,
            shiftSteps,
            preShiftSteps,
            postShiftSteps,
            ...rest
        } = obj;
        fullDaySteps.map(el => {
            rest[el['time']] = el.stepCount;

        })
        XLSX.utils.book_append_sheet(workBook, XLSX.utils.json_to_sheet(fullDaySteps), `Full Day Steps on ${obj.date}`)
        shiftSteps.map(el => {
            rest[el['time']] = el.stepCount;

        })
        XLSX.utils.book_append_sheet(workBook, XLSX.utils.json_to_sheet(shiftSteps), `Shift Steps on ${obj.date}`)
        preShiftSteps.map(el => {
            rest[el['time']] = el.stepCount;

        })
        XLSX.utils.book_append_sheet(workBook, XLSX.utils.json_to_sheet(preShiftSteps), `Pre-Shift Steps on ${obj.date}`)
        postShiftSteps.map(el => {
            rest[el['time']] = el.stepCount;

        })
        XLSX.utils.book_append_sheet(workBook, XLSX.utils.json_to_sheet(postShiftSteps), `Post-Shift Steps on ${obj.date}`)

        
        return {
            ...rest,
            
        }

    })

    //XLSX.utils.book_append_sheet(workBook, stepSheet, "Step Interday Data")
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook,`Daily Report - ${userData[0].lastName}-${userData[0].firstName.charAt(0)}(${req.query.periodStart}-${req.query.periodEnd}).xlsx`);

    let settings = {
        fileName: `${userData[0].lastName}-${userData[0].firstName.charAt(0)}(${req.query.periodStart}-${req.query.periodEnd})`, // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
      }

    console.log(stepData);
    res.status(200).send(heartRateData);
    
}
/**
 * Pulls data for weekly report.  This data is heavily computed(mostly totals and averages) and currently makes a spreadsheet containing two sheets
 *  1. Averages and totals for each weekly period within the date range
 *  2. Averages and totals for each day within the period
 * @param  {} req
 */
const weeklyReport = async (req, res) => {
//     Date
// -	Weekly date format – perhaps just indicating the date the weekly survey was completed.
// Shift summary – days worked,  start/end OR off
// -	Date – 20220714 time
// o	Willem ?
// Average of daily: Fitbit total steps, active minutes, hours with 250+ steps
// •	2 hours pre
// •	2 hours post
// •	Shift

// Answers to the questions asked weekly
 
    let surveyIDs = [];
    let weeklyDates = [];
    let weeklyShiftData = [];
    let stepCount = 0;
    let dailySurveyPeriod = await getSurveyPeriod(req.query.periodStart, req.query.periodEnd);

    const query = `SELECT q.*, sa.answer, q.id, s.surveyDate, s.id as surveyID FROM mydb.survey s INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id
    INNER JOIN question q ON q.id = sq.Question_Id
    INNER JOIN surveyanswer sa ON sq.id=sa.survey_question_id 
    WHERE s.nurses_ID = ${req.query.nurses_id} AND  s.surveyDate in (:dailySurveyPeriod) AND s.survey_type_id = 2`;
    const surveyResults = await db.sequelize.query(query,{
        replacements: {dailySurveyPeriod},
        type: db.sequelize.QueryTypes.SELECT
    })

    const dailyQuery = `SELECT q.*, sa.answer, q.id, s.surveyDate, s.id as surveyID FROM mydb.survey s INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id
    INNER JOIN question q ON q.id = sq.Question_Id
    INNER JOIN surveyanswer sa ON sq.id=sa.survey_question_id 
    WHERE s.nurses_ID = ${req.query.nurses_id} AND  s.surveyDate in (:dailySurveyPeriod) AND s.survey_type_id = 1`;

    const dailyQueryResults = await db.sequelize.query(dailyQuery, {
        replacements: {dailySurveyPeriod},
        type: db.sequelize.QueryTypes.SELECT
    })

    for (var i in surveyResults) {
        if (!weeklyDates.includes(surveyResults[i].surveyDate)) {
            weeklyDates.push(surveyResults[i].surveyDate);
        }
    }

    const userData = await getUserInfo(req.query.nurses_id);
    //console.log(userData);

    for (var i in dailyQueryResults) {

        surveyIDs.push(dailyQueryResults[i].surveyID);
    }

    const shiftQuery = `SELECT sd.*, s.surveyDate from shiftdata sd INNER JOIN survey s ON sd.survey_Id = s.id WHERE survey_Id in (:surveyIDs)`;
    const shiftResults = await db.sequelize.query(shiftQuery, {
        replacements: {surveyIDs},
        type: db.sequelize.QueryTypes.SELECT
    })

    const fbResults = await getFitbitData(req.query.nurses_id, dailySurveyPeriod);

    const surveyData = surveyResults.map(element => {
        element.answer = decrypt(element.answer)
        let questionText = element.questionText;
        let answer = element.answer;
        let date = element.surveyDate;
        const data = {
            date,
            questionText,
            answer
        }
        return data;
    })

    //Computes data for weekly information.  Inside this method is the computations for the daily information as well.
    const computedData = await weeklyDates.map((element, index) => {
        let stepCount = 0;
        let weeklyHoursOverThreshold = 0;
        let weeklyActiveMinutes = 0
        let weeklyFullDaySteps = [] 
        let weeklyShiftSteps = []
        let weeklyPreShiftSteps = [] 
        let weeklyPostShiftSteps = [];
        const stepData = fbResults.map(el => {
           
            if (el.date >= element && el.date < weeklyDates[index + 1]) {
                
                let activeMinutes = 0;

                for (let i = 1; i < el.hr_activity_all["activities-heart"][0].value.heartRateZones.length; i++) {
                    //console.log(el.hr_activity_all["activities-heart"][0].value.heartRateZones[i])
                    activeMinutes += el.hr_activity_all["activities-heart"][0].value.heartRateZones[i].minutes;
                }
                weeklyActiveMinutes += activeMinutes;

                //console.log(stepCount);
                for (var i in shiftResults) {
                    let shiftDate = shiftResults[i].surveyDate;

                    if (shiftDate == el.date && shiftDate < weeklyDates[index + 1]) {
                        //console.log(el.step_activity_all['activities-steps']?.[0].value)
                        let totalSteps = el.step_activity_all['activities-steps']?.[0].value;
                        
                        let fullDaySteps =  getStepsByHours(el.step_activity_all?.['activities-steps-intraday']?.dataset);
                        weeklyFullDaySteps.push({fullDaySteps});
                        //console.log(JSON.stringify(weeklyFullDaySteps));
                        //console.log(fullDaySteps)
                        let dayStepsAvg = getAverage(fullDaySteps);
                        //console.log(fullDaySteps)
                        //console.log(`FULLDAYSTEPS: ${JSON.stringify(fullDaySteps)}`);
                        fullDaySteps =  getStepsAboveThreshold(fullDaySteps, 10);
                        weeklyHoursOverThreshold += fullDaySteps.length;


                        //console.log(`FULLDAYSTEPSFILTERED: ${JSON.stringify(fullDaySteps)}`);
                        let shiftSteps =  getStepsByHours(el.step_activity_shift);
                        weeklyShiftSteps.push(shiftSteps);
                        let shiftStepsAvg = getAverage(shiftSteps)
                        let shiftStepsTotal = getTotal(shiftSteps);
                        shiftSteps =  getStepsAboveThreshold(shiftSteps, 10);
                        
                
                        let preShiftSteps =  getStepsByHours(el.step_activity_preshift);
                        weeklyPreShiftSteps.push(preShiftSteps);
                        let preShiftStepsTotal = getTotal(preShiftSteps);
                        let preShiftStepsAvg = getAverage(preShiftSteps);
                        preShiftSteps =  getStepsAboveThreshold(preShiftSteps, 10);
                
                        let postShiftSteps =  getStepsByHours(el.step_activity_postshift);
                        weeklyPostShiftSteps.push(postShiftSteps);
                        let postShiftStepsTotal = getTotal(postShiftSteps);
                        let postShiftStepsAvg = getAverage(postShiftSteps);
                        postShiftSteps =  getStepsAboveThreshold(postShiftSteps, 10);
                        
                        
                        
                        //console.log(el.step_activity_all['activities-steps'][0].value);
                        stepCount += parseInt(el.step_activity_all['activities-steps'][0].value);
                
                        weeklyShiftData.push({
                            date: shiftDate,
                            activeMinutes,
                            totalSteps,
                            startTime: decrypt(shiftResults[i].startTime),
                            endTime: decrypt(shiftResults[i].endTime),
                            numberOfHoursOverStepThreshold: shiftSteps.length,
                            shiftStepsTotal,
                            AvgStepsOnShift: shiftStepsAvg,
                            preShiftStepsTotal,
                            AvgStepsPreShift: preShiftStepsAvg,
                            postShiftStepsTotal,
                            AvgStepsPostShift: postShiftStepsAvg,
                            AvgStepsFullDay: dayStepsAvg,


                        })
                    }
                }
        
                //console.log(stepAvg);
                const dataEntry = {
                    "date": el.date,
                    //totalSteps,
                    
                    // shiftSteps,
                    // preShiftSteps,
                    // postShiftSteps

                }
                return dataEntry;
            }
        })
        let stepAvg = Math.round(((stepCount / fbResults.length) + Number.EPSILON) * 100) / 100
        
        let weeklyShiftTotal = 0;
        let numValues = 0
        for (let i = 0; i < weeklyShiftSteps.length; i++) {
            weeklyShiftTotal += getTotal(weeklyShiftSteps[i]);
            numValues++;
        }
        let weeklyShiftStepAvg =  Math.round(((weeklyShiftTotal / numValues) + Number.EPSILON) * 100) / 100;
        let weeklyPreShiftTotal = 0;
        numValues = 0;
        //console.log(weeklyShiftStepAvg);
        for (let i = 0; i < weeklyPreShiftSteps.length; i++) {
            weeklyPreShiftTotal += getTotal(weeklyPreShiftSteps[i]);
            numValues++;
        }
        let weeklyPreShiftStepsAvg = Math.round(((weeklyPreShiftTotal / numValues) + Number.EPSILON) * 100) / 100;

        numValues = 0;
        let weeklyPostShiftTotal = 0;
        for (let i = 0; i < weeklyPostShiftSteps.length; i++) {
            weeklyPostShiftTotal += getTotal(weeklyPostShiftSteps[i]);
            numValues++;
        }
        let weeklyPostShiftStepsAvg = Math.round(((weeklyPostShiftTotal / numValues) + Number.EPSILON) * 100) / 100;
        //weeklyStepAvg = getAverage(weeklyFullDaySteps)        
        return {
            "date": element,
            stepCount,
            stepAvg,
            weeklyActiveMinutes,
            weeklyHoursOverThreshold,
            weeklyShiftTotal,
            weeklyShiftStepAvg,
            weeklyPreShiftTotal,
            weeklyPreShiftStepsAvg,
            weeklyPostShiftTotal,
            weeklyPostShiftStepsAvg,

        }
    })

    const weeklyOverview = XLSX.utils.json_to_sheet(computedData);
    const surveySheet = XLSX.utils.json_to_sheet(surveyData);
    const shiftDataSheet = XLSX.utils.json_to_sheet(weeklyShiftData)
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, weeklyOverview, "Overview Data");
    XLSX.utils.book_append_sheet(workBook, surveySheet, "Survey Questions")
    XLSX.utils.book_append_sheet(workBook, shiftDataSheet, "Shift Data");
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook,`Weekly Report - ${userData[0].lastName}-${userData[0].firstName.charAt(0)}(${req.query.periodStart}-${req.query.periodEnd}).xlsx`);
    res.status(200).send(workBook);
}

export {sleepReport, dailyReport, weeklyReport};