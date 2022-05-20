import express, { Router } from 'express';
import passport from 'passport';
import {registerNewUser, logInUser} from '../controllers/user-api-controller.mjs';

const router = express.Router();

router.route('/users')
.post(registerNewUser);

router.route('/login')
.post(passport.authenticate('local', {session: false}), logInUser);

export default router;