Overview
--------

This web app is designed to be a user survey to collect data based on the user's fatigue and sleep. Data collected from the users is combined with data collected from the user's Fitbit device to generate reports in Excel spreadsheet format. The project was developed in Node.js, with MySQL, Express.JS, and React.

This project was commissioned by Camosun Innovates for use in a study of perioperative nurses.

This project was built by students at Camosun College for the 2022 Capstone Program.

Front End
--------------

The front end is used by survey subjects to complete daily and weekly surveys, as well as review some of the data collected through the surveys and collected by the Fitbit device.

### Major Modules

[React](https://www.npmjs.com/package/react-scripts) -- User Interface module for building front end applications

 [React-Scripts](https://www.npmjs.com/package/react-scripts) -- Configuration files for Create React App

 [Axios](https://www.npmjs.com/package/axios) -- Connecting and retrieving data from the API

 [Recharts](https://www.npmjs.com/package/recharts) -- Displaying data in user stats page

 [Jwt-decode](https://www.npmjs.com/package/jwt-decode) -- Allows decoding of security token to send data to/from API

### Pages

Login/Signup -- Pages for registering on site and logging in.

Dashboard -- Main index page, shows all incomplete surveys for the current survey period

User Stats -- displays biometric data related to user's heart rate and sleep

Daily Survey -- Contains a list of questions including a calendar to input user's shift. Redirects to the API after completion to gather data from Fitbit

Weekly Survey -- List of questions. Does not gather Fitbit data so remains on website after submission

### Usage

Server is run with the command:

**HTTPS=true npm start**

HTTPS is needed as the front-end and API use SSL certificates. Because this was developed behind a VPN, the site uses a self-signed certificate.

Back End
-------------

The database is built with MySQL, and currently runs on the same server as the API. All personal information, including survey answers and Fitbit data, is stored in an encrypted state.


### Data Encryption

After decryption, all entries in **fitbitdata** are stored in JSON format. The tables **user, user_info, surveyanswer,** and **shiftdata** will also contain encrypted entries.

### Usage

Command to run the MySQL server will vary by setup. The script containing all tables is found inside the Documentation folder.

API
--------

### Major Modules

[Express](https://www.npmjs.com/package/express) -- Middleware to run the API

[Sequelize](https://www.npmjs.com/package/sequelize) -- Database modelling and querying

[Passport](https://www.npmjs.com/package/passport-jwt) -- User Authentication with JSON Web Tokens

[Fitbit-Node](https://www.npmjs.com/package/fitbit-node) -- Oauth2 integration with Fitbit API

[Crypto-es](https://www.npmjs.com/package/crypto-es) -- Handles database encryption

[XLSX](https://www.npmjs.com/package/xlsx) -- Exports data from API

### Endpoints

/authorize -- Redirects to Fitbit API for oauth2 authentication

/fb -- landing page after Fitbit redirect -- gathers data from Fitbit API and stores in DB

/login

/users -- register and update user information

/stepcount -- retrieve data for steps page on front end

/allsurveys -- returns user's survey data

/lastsubmission -- returns Fitbit and survey information for last survey submitted

/userstats -- returns heart rate, sleep and fatigue info

/dashboard -- returns surveys not yet completed

/weeklysurvey -- post user survey answers or get survey questions

**Research Endpoints**

/sleepresearch -- generates Excel spreadsheet on user's sleep

/dailyreport -- generates Excel spreadsheet on user's daily biometric data and surveys

/weeklyreport -- generates Excel spreadsheet on user's weekly survey's and totals and averages of biometric data

See documentation on Research Tool for more information on these reports

### Usage

Usage of the API will require an SSL certificate. The application is currently using a self-signed certificate.

The API can be run with the command:

**npm run dev**

Future Development
-----------------------

### Oauth2 Login

Fitbit's API supports Oauth2 authentication through the web app. The project could be modified to use Fitbit's own account data, rather than creating a separate login for this web app.

### Expansion of Research Tool

1. Allow modification of survey questions stored within the database

2. Examine ways to further secure the endpoints

3. Allow reports on multiple users to be generated at once

4. Allow the researcher to select which data appears on each report

### Front End

1. The weekly surveys could be modified to allow users to determine which dates start and end the week.

2. The site could redirect users to login page after signup.

3. Landing page after daily survey completion could be created.

### API

1. A method of exported nested JSON to Excel would simplify the spreadsheets exported.

2. Many sections of code could be refactored

3. Remove non-REST endpoint

4. Create a model for an entire survey: Fitbit data, survey info, survey questions, and answers.
