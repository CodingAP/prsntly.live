/**
 * presentation/src/routers/main.js
 * 
 * The router that hosts all the URLS.
 * 
 * Here are the paths:
 * '/' - The main homepage where you upload the presentation
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import express from 'express';
import path from 'path';
import { __dirname } from '../common.js';

const router = express.Router();

// Default Home Page
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

export default router;