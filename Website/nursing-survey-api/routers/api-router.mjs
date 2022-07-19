import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import { getWeeklyQuestions, postWeeklySurvey, getWeeklySurvey, getAllSurveys } from '../controllers/survey-api-controller.mjs';
import {registerNewUser, logInUser, getUserData, getUserStats} from '../controllers/user-api-controller.mjs';
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
// router.route('/fb')
// .post(integrateFBData)

/* router.route('/survey_questions')
.get(getSurveyQuestions)
.post(saveSurveyAnswers); */
//Not Yet Implemented
//.patch(updateUserInfo);

router.route('/login')
.post(passport.authenticate('local', {session: false}), logInUser);
//Not Yet Implemented
//.patch(updateUserPassword);

router.route('/allsurveys')
.get(getAllSurveys);

router.route('/userstats/:userid')
.get(getUserStats);

router.route('/lastsubmission/:userid')
//.get(getLastSurvey);

router.route('/dashboard/:userid')
//.get(getDashboardInfo);

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
// .patch(updateWeeklyData)

// router.route('/researcher')
// .get(getResearchData)
export default router;