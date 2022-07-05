import app from './express.mjs';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
//const app = require('./express.mjs')
const port = process.env.PORT || 3004;

const options = {
    key: fs.readFileSync('rootCA2.key'),
    cert: fs.readFileSync('rootCA.pem')
  };

// app.listen(port, (err) => {
//     if (err) console.log(err);
//     console.info(`Server started on port ${port}`);
// });

https.createServer(options, app).listen(port, (err) => {
    if (err) console.log(err);
    console.info(`Server started on port ${port}`);
})