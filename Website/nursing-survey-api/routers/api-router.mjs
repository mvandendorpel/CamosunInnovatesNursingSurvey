import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import { getWeeklyQuestions, postWeeklySurvey, getWeeklySurvey, getAllSurveys, getLastSurvey, getDashboardInfo, getShiftData, isSurveyAlreadyTaken } from '../controllers/survey-api-controller.mjs';
import {registerNewUser, logInUser, getUserData, getUserStats, getUserList} from '../controllers/user-api-controller.mjs';
import { getStepData } from '../controllers/fb-api-controller.mjs';
import { sleepReport, dailyReport, weeklyReport } from '../controllers/research-api-controller.mjs';
//import {integrateFBData} from '../controllers/fb-api-controller.mjs'
import cors from 'cors';

var corsOptionsDelegate = function (req, callback) {
  
    var corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response

    callback(null, corsOptions) // callback expects two parameters: error and options
}
const router = express.Router();
router.use(cors({ origin: true }));
router.route('/users')
.post(registerNewUser)
.get(getUserData);




router.route('/login')
.post(passport.authenticate('local', {session: false}), logInUser);
//Not Yet Implemented
//.patch(updateUserPassword);

router.route('/stepcount')
.get(getStepData);

router.route('/allsurveys')
.get(getAllSurveys);

router.route('/userstats')
.get(getUserStats);

router.route('/lastsubmission')
.get(getLastSurvey);

router.route('/dashboard')
.get(getDashboardInfo);

router.route('/weeklysurvey', cors(corsOptionsDelegate), function(req, res, next) {
    
    next();
})
.post(postWeeklySurvey)
.get(getWeeklySurvey);


router.route('/weeklysurvey/:surveyType', cors(corsOptionsDelegate), function(req, res, next) {
    
    next();
})
.get(getWeeklyQuestions, cors(corsOptionsDelegate), function(req, res, next){
    
    next();
  });


router.route('/userlist')
.get(getUserList);

router.route('/sleepResearch')
.get(sleepReport);

router.route('/dailyreport')
.get(dailyReport);

router.route('/weeklyreport')
.get(weeklyReport);

router.route('/shiftdata')
.get(getShiftData);

router.route('/surveytaken')
.post(isSurveyAlreadyTaken);
export default router;