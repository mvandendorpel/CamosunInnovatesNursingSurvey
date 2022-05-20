import 'dotenv/config.js';
//import './db.js';
import express, { application } from 'express'; 
import cookieParser from 'cookie-parser'; 
import compression from 'compression'; 
import morgan from 'morgan'; 
import cors from 'cors'; 
import apiRouter from './routers/api-router.mjs';
import rateLimit from 'express-rate-limit';
import passport from 'passport';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(compression());
app.use(morgan('dev')); 
app.use(cors()); 
app.use(rateLimit());
app.use(passport.initialize());


app.get('/', (req, res) => {
    express.urlencoded();
    cors({
        origin: 'http://localhost3004'
    })
    res.send("Node.js server is live");
})

app.use('/api', apiRouter);

export default app;