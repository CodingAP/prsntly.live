/**
 * presentation/index.js
 * 
 * The main server for the backend prototype.
 * Just a simple Express server that passes to the router in presentation/src/router.js
 * 
 * by Alex Prosser
 * 10/8/2023
 */

import express from 'express';
import path from 'path';
import 'dotenv/config';
import { __dirname } from './src/common.js';
import router from './src/router.js';

const app = express();
const PORT = 1337 || process.env.PORT;

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/', router);

app.listen(PORT, () => {
    console.log(`prsntly.live listening on port ${PORT}`)
});