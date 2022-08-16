
import passport from 'passport';
import LocalStrategy from 'passport-local';
import jwt from 'jsonwebtoken'
import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import argon2 from 'argon2';
import mysql from 'mysql';
import dotenv from 'dotenv';
import FitbitApiClient from "fitbit-node";
import db from '../models/index.mjs';
import sequelize from 'sequelize';
import { User } from '../models/user.model.mjs';
import { UserProfile } from '../models/userProfile.mjs';
import { Op } from 'sequelize';
import { decrypt } from '../util.js';
import { Fitbit } from '../models/fitbit.mjs';

//CONTROLLER FILE FOR ENDPOINTS RELATED TO USER INFORMATION(CREATING, UPDATING, AUTHENTICATING)

dotenv.config();



var connection = mysql.createConnection({
    host: 'localhost',
    user: 'api',
    database: 'mydb',
    password: 'N/=Fb5F8g-xPB\<y'

})

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

//Determine if user info already exists
const alreadyExists = async (email, username) => {
    // let userExists = false;
    return await User.findOne({
        where: {
            [Op.or]: [
                {
                    username: username,
                }, {
                    email: email
                }
            ]
            
        }
    })
    // await connection.query("SELECT * FROM user WHERE username = ? OR email = ?", [email, username], function () {userExists = true });
    // return userExists;
};


/**
 * Create a new user in the database
 * @param  {} req.body Should contain an email, username, password, firstName and lastName

 */
const registerNewUser = async (req, res) => {
    try {
        console.log("reqeust", req);
        if (! await alreadyExists(req.body.email, req.body.username)) {
            const hash = await argon2.hash(req.body.password, {
                type: argon2.argon2id
            });
            // var query = "INSERT INTO user (email, password, username) VALUES (?, ?, ?);"
            const user = await User.create({
                email: req.body.email,
                password: hash,
                username: req.body.username
            })

            await UserProfile.create({
                firstName:  req.body.firstName,
                lastName: req.body.lastName,
                userID: user.dataValues.id
            });

            // logInUser({
            //     user: {
            //         username:req.body.username,
            //         ID:  user.dataValues.id
            //     }
            // }, res);
        
            // connection.query(query, [req.body.email, hash, req.body.username],(err, result, fields) => {
            //     console.log('INSERT ', result)
            //     const userId = result.insertId;
            //     const insertUserInfo = "INSERT INTO user_info (firstName, lastName, userID) VALUES(?,?,?);"
            //     connection.query(insertUserInfo, [req.body.firstName, req.body.lastName, userId]);
            // });
            //res.redirect(client.getAuthorizeUrl(scope, 'https://10.51.253.2:3004/fb'))
            // res.status(201).send("User Created");
        }
        else {
            res.status(403).send("Username or email already exists");
        }
    }
    catch(err) {
        res.status(400).send("Bad Request.  The message in the body of the Request is either missing or malformed");
        console.log(err);
    }

}

//Log in user
const logInUser = (req, res) => {
    // generates a JWT Token
    //let payload = { "id" : "1"};
    console.log('login', req);
    jwt.sign(
        { username: req.user.username, userID: req.user.ID },
        process.env.JWT_SECRET,
        { expiresIn: '1h'},
        ( error, token) => {
            if (error) {
                res.status(400).send('Bad Request. Couldn\'t generate token.');
            } else {
                res.status(200).json({ token: token });
                console.log(token);
            }
        }
        
    );
    
}


//Returns user profile data.
const getUserData = async (req, res) => {
    try {
        //var token = jwt.decode(req.token);
        var  query = `SELECT user.ID, user.username, user_info.firstName, user_info.lastName, user_info.dateOfBirth, user_info.city, user_info.gender FROM user INNER JOIN user_info ON user.id = user_info.userID where user.id = ${req.query.nurses_id};`; 
        console.log(query);
        let [result, metadata] = await db.sequelize.query(query);
        // result = result.map(user => {
        //     user.firstName = decrypt(user.firstName);
        //     user.lastName = decrypt(user.lastName);
        //     user.dateOfBirth = user.dateOfBirth ? decrypt(user.dateOfBirth) : '';
        //     user.city = user.city ? decrypt(user.city) : 'fail';
        //     user.gender = user.gender ? decrypt(user.gender) : '';
        //     return user;
        // })
        console.log(result);
        res.status(200).send(result);
    }
    catch(err) {
        console.log(err);
        res.status(400).send(err);
    }

}

//small function to filter out null values
function filterOutNull(item) {
    return (item != null && item != NaN);
  }

  
/**
 * Returns biometric data for a user:
 *  - Heart rate for last 7 days
 *  - minutes spent at each level of sleep
 *  - Response from the user regarding their level of fatigue after waking up
 * This data is used for the stats page on the front end
 * @param  {} req.query.nurses_id

 */
const getUserStats = async(req, res) => {
    try {
        //get Sleep data
        const sleepQuery = `SELECT sleep from fitbitdata WHERE nurses_ID = ${req.query.nurses_id}`;
        const [sleepResults, metadata] = await db.sequelize.query(sleepQuery);
        const sleepInfo = await sleepResults.map((element) => {
            const decryptedSleep = decrypt(element.sleep.replaceAll('"',''));
            console.log(decryptedSleep)
            element.sleep = decryptedSleep ? JSON.parse(decryptedSleep) : '';
            return element?.sleep?.summary?.stages;          
        });
        
        const now = new Date();
        //Get Heart Rate data for last 7 days found
        const heartResults = await Fitbit.findAll({
            where: {
                nurses_ID: req.query.nurses_id
            },
            order: [
                ['date', 'DESC']
            ],
            limit: 7
            
        })
        //const [heartResults, metadataTwo] = await db.sequelize.query(heartQuery);
        const heartRateInfo = await heartResults.map((element) => {
            //Collects users resting heart rate for the day
            if (element['hr_activity_all']['activities-heart'][0].value.restingHeartRate != null) {
                return {            
                    "dateTime": element['hr_activity_all']['activities-heart'][0].dateTime,
                    "restingHeartRate": element['hr_activity_all']['activities-heart']?.[0].value.restingHeartRate
                }
            }
            else {
                return {
                    "dateTime": element['hr_activity_all']['activities-heart']?.[0].dateTime,
                    "restingHeartRate": null
                }
            }
        });
        const query = `SELECT q.*, sa.answer, q.id FROM mydb.survey s INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id
        INNER JOIN question q ON q.id = sq.Question_Id
        INNER JOIN surveyanswer sa ON sq.id=sa.survey_question_id 
        WHERE s.nurses_ID = ${req.query.nurses_id} AND s.survey_type_id = 1 AND q.id = 5 OR q.id = 7`;
        //Get the numerical value associated with the survey answer
        let [fatigueResults, metadataThree] = await db.sequelize.query(query);
        fatigueResults = fatigueResults.map(element => {
            return parseInt(decrypt(element.answer).slice(0));
        })

        const fatigueResponse = new Array(7).fill(0);
        //Count these values into an array
        fatigueResults.map(element => {
            if (element != null) {
                fatigueResponse[element - 1]++;
            }
        })
        const sleepResponse = sleepInfo.filter(filterOutNull);
        const heartRateResponse = heartRateInfo.filter(filterOutNull);

        const responseData = {
            sleepResponse,
            heartRateResponse,
            fatigueResponse
        }
        res.status(200).send(responseData);
    }
    catch(err) {
        res.status(400).send("There was an error in gathering the data")
        console.log(err);
    }
}   


//used by research tool to get list of all users
const getUserList = async (req, res) => {
    try {
        const query = 'SELECT ui.firstName, ui.lastName, u.ID FROM user u INNER JOIN user_info ui ON u.ID = ui.userID;';
        let results = await db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT} );
        results = results.map(user => {
            if(user.firstName.charAt(0) == "U") {
                user.firstName = decrypt(user.firstName);
                user.lastName = decrypt(user.lastName);
            }
            return user;
        })
        console.log(results)
        res.status(200).send(results);
    }
    catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
}


//Not yet implemented
/* const updateUserPassword = async (req, res) => {
    try {
        const hash = await argon2.hash(req.body.password, {
            type: argon2.argon2id
        });
        var query = "UPDATE users SET password = ? WHERE username = ?";
        userDB.run(query, [hash, req.body.username]);
        res.status(201).send("Password Updated");
    }
    catch(err) {
        console.log(err);
    }
} */

// Configure JWT Token Auth
// passport.use(new JwtStrategy(
//     jwtOptions, (jwt_payload, done) => {
//         userModel
//         .findById(jwt_payload.sub)
//         .exec( (error, user) => {
//             // error in searching
//             if (error) return done(error);
//             if (!user) {
//                 // user not found
//                 return done(null, false);
//             } else {
//                 // user found
//                 return done(null, user);
//             }
//         })
//     }
// ));


//Passport strategy for user login
passport.use(new LocalStrategy(
    async (email, password, done) => {
        var sql = "SELECT email,password, ID FROM user WHERE email = ? LIMIT 1;";
        connection.query(sql, email, async (err,results) => {
            if (err) {
                console.log(err);
            }
            if (!results) return done(null, false);
            console.log(password);
            if(!await argon2.verify(results[0].password, password)) {return done(null, false);}
            return done(null, results[0]);
            })
        })
    );



export {registerNewUser, logInUser, getUserData, getUserStats, getUserList};