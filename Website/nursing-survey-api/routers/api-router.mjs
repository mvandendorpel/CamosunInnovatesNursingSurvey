import express, { Router } from 'express';
import passport from 'passport';
import {registerNewUser, logInUser} from '../controllers/user-api-controller.mjs';

const router = express.Router();

router.route('/users')
.post(registerNewUser)
//Not Yet Implemented
//.patch(updateUserInfo);

router.route('/login')
.post(passport.authenticate('local', {session: false}), logInUser);
//Not Yet Implemented
//.patch(updateUserPassword);

//Not Yet Implemented
// router.route('/startsurvey')
// .post(postStartDaySurvey)
// .get(getStartDayData)
// .patch(editStartDayData);


// router.route('/endsurvey')
// .post(postEndDaySurvey)
// .get(getEndDayData)
// .patch(editEndDayData);

// router.route('/weeklysurvey')
// .post(postWeeklySurvey)
// .get(getWeeklyData)
// .patch(updateWeeklyData)

// router.route('/researcher')
// .get(getResearchData)
export default router;