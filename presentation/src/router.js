/**
 * presentation/src/router.js
 * 
 * The router that hosts all the URLS.
 * Here are the paths:
 * / - Default Home Page
 * /create-presentation - Uploads and converts a presentation. Returns a code to be used to connect to the room
 * 
 * by Alex Prosser
 * 10/8/2023
 */

import express from 'express';
import { uploadPresentation } from './upload.js';
import { sendFile } from './common.js';
import { convertToPDF, convertToImages } from './convert.js';

const router = express.Router();

// Default Home Page
router.get('/', (request, response) => {
    sendFile('index.html', response);
});

// Uploads and converts a presentation.
// Returns a code to be used to connect to the room
router.post('/create-presentation', async (request, response, next) => {
    // check for empty url parameters
    if (request.query.filename === null) {
        response.json({ status: 400, message: 'Please provide a filename to upload!' });
        return;
    }

    try {
        // generate a code to use 
        const code = new Array(4).fill(0).map(_ => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]).join('');

        // upload and convert
        const filename = await uploadPresentation(request);
        const pdfFilename = await convertToPDF(filename);
        const images = await convertToImages(pdfFilename);

        response.json({ status: 200, message: 'Presentation converted! All done!', data: { code, images } });
    } catch (error) {
        response.json(error);
    }
});

export default router;