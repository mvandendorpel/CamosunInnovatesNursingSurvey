import app from './express.mjs';
import cors from 'cors';
//const app = require('./express.mjs')
const port = process.env.PORT || 3004;

app.listen(port, (err) => {
    if (err) console.log(err);
    console.info(`Server started on port ${port}`);
});