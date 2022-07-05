import passport from 'passport';
import LocalStrategy from 'passport-local';
import jwt from 'jsonwebtoken';
import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import argon2 from 'argon2';
import mysql from 'mysql';
import axios from 'axios';
import dotenv from 'dotenv';
import FitbitApiClient from "fitbit-node";

dotenv.config();

const client = new FitbitApiClient({
    clientId: `${process.env.FB_OAUTH_ID}`,
    clientSecret: `${process.env.FB_CLIENT_SECRET}`,
    apiVersion: "1.2"
})

const integrateFBData = async(req, res) => {
    try {
        client.getAccessToken
    }
    catch(err) {
        console.log(err);
        res.status(400).send("Error getting Fitbit data");
    }
}
