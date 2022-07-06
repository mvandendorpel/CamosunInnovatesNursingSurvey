import passport from 'passport';
import LocalStrategy from 'passport-local';
import jwt from 'jsonwebtoken'
import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import argon2 from 'argon2';
import mysql from 'mysql';
import dotenv from 'dotenv';
import FitbitApiClient from "fitbit-node";


dotenv.config();
const client = new FitbitApiClient({
    clientId: `${process.env.FB_OAUTH_ID}`,
    clientSecret: `${process.env.FB_CLIENT_SECRET}`,
    apiVersion: "1.2"
})

const scope = 'activity heartrate location nutrition profile settings sleep weight'
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


const alreadyExists = async (email, username) => {
    let userExists = false;
    await connection.query("SELECT * FROM user WHERE username = ? OR email = ?", [email, username], function () {userExists = true });
    return userExists;
};

const verifyPassword = async function(plainTextPassword, dbHashedPassword) {
    //const dbHashedPassword = this.password;
    try {
        return await argon2.verify(dbHashedPassword, plainTextPassword);
    } catch (err) {
        console.log('Error verifying password' + err);
    }
}

const registerNewUser = async (req, res) => {
    try {
        if (! await alreadyExists(req.body.email, req.body.username)) {
            const hash = await argon2.hash(req.body.password, {
                type: argon2.argon2id
            });
            var query = "INSERT INTO user (email, password, username) VALUES (?, ?, ?);"
        
            connection.query(query, [req.body.email, hash, req.body.username],(err, result, fields) => {
                console.log('INSERT ', result)
                const userId = result.insertId;
                const insertUserInfo = "INSERT INTO user_info (firstName, lastName, userID) VALUES(?,?,?);"
                connection.query(insertUserInfo, [req.body.firstName, req.body.lastName, userId]);
            });
            //res.redirect(client.getAuthorizeUrl(scope, 'https://10.51.253.2:3004/fb'))
            res.status(201).send("User Created");
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

const logInUser = (req, res) => {
    // generates a JWT Token
    jwt.sign(
        { sub: req.user._id,username: req.user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h'},
        ( error, token) => {
            if (error) {
                res.status(400).send('Bad Request. Couldn\'t generate token.');
            } else {
                res.status(200).json({ token: token });
            }
        }
    );
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


passport.use(new LocalStrategy(
    async (email, password, done) => {
        var sql = "SELECT email,password FROM user WHERE email = ? LIMIT 1;";
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

export {registerNewUser, logInUser};