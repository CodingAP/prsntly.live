/**
 * presentation/src/routers/main.js
 * 
 * The router that hosts all the URLS.
 * 
 * Here are the paths:
 * '/' - The main homepage where you upload the presentation
 * '/presenter' - The presenter view where clients can control it
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import express from 'express';
import path from 'path';
import { __dirname } from '../common.js';

const router = express.Router();

// The main homepage where you upload the presentation
// Sends presentation/public/index.html
router.get('/', (request, response) => {
    response.sendFile('index.html', {
        root: path.join(__dirname, 'public'),
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    });
});

// The presenter view where clients can control it
// Sends presentation/public/presenter.html
router.get('/presenter', (request, response) => {
    response.sendFile('presenter.html', {
        root: path.join(__dirname, 'public'),
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    });
});

export default router;