import sqlite3 from 'sqlite3';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import jwt from 'jsonwebtoken'
import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

const alreadyExists = async ( email, username ) => (
    //
);

const registerNewUser = (async, res) => {

}

const logInUser = (req, res) => {

}

// Configure JWT Token Auth
passport.use(new JwtStrategy(
    jwtOptions, (jwt_payload, done) => {
        userModel
        .findById(jwt_payload.sub)
        .exec( (error, user) => {
            // error in searching
            if (error) return done(error);
            if (!user) {
                // user not found
                return done(null, false);
            } else {
                // user found
                return done(null, user);
            }
        })
    }
));


passport.use(new LocalStrategy(
    (username, password, done) => {
        userModel
        .findOne({
            '$or': [
                {email: username},
                {username: username}
            ]
        })
        .exec(async (error, user) => {
            if (error) return done(error);

            if(!user) return done(null, false);

            if(!await user.verifyPassword(password)) { return done(null, false);}

            return done(null, user);
        });
    }
));

export {registerNewUser, logInUser};