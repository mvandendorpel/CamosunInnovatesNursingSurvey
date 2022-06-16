import express from 'express';
import passport from 'passport';
import { getWeeklyQuestions, postWeeklySurvey } from '../controllers/survey-api-controller.mjs';
import {registerNewUser, logInUser} from '../controllers/user-api-controller.mjs';
import cors from 'cors';

var corsOptionsDelegate = function (req, callback) {
  
    var corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response

    callback(null, corsOptions) // callback expects two parameters: error and options
}
const router = express.Router();
router.use(cors({ origin: true }));
router.route('/users')
.post(registerNewUser)

/* router.route('/survey_questions')
.get(getSurveyQuestions)
.post(saveSurveyAnswers); */
//Not Yet Implemented
//.patch(updateUserInfo);

router.route('/login')
.post(passport.authenticate('local', {session: false}), logInUser);
//Not Yet Implemented
//.patch(updateUserPassword);


router.route('/weeklysurvey', cors(corsOptionsDelegate), function(req, res, next) {
    res.json({msg : "This is finally working"});
    next();
})
.post(postWeeklySurvey);


router.route('/weeklysurvey/:surveyType', cors(corsOptionsDelegate), function(req, res, next) {
    res.json({msg : "This is finally working"});
    next();
})
.get(getWeeklyQuestions, cors(corsOptionsDelegate), function(req, res, next){
    res.json({msg : "This is finally working from .get"});
    next();
  });
// .patch(updateWeeklyData)

// router.route('/researcher')
// .get(getResearchData)
export default router;