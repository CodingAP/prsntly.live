/**
 * presentation/src/routers/api.js
 * 
 * The router that hosts all the API REST calls.
 * 
 * Here are the paths:
 * '/api/create-presentation' - Uploads and converts a presentation and returns a code to be used to connect to the room.
 * '/api/end-presentation' - Ends the presentation from code given.
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import fs from 'fs';
import express from 'express';
import { uploadPresentation } from '../upload.js';
import { convertToPDF, convertToImages } from '../convert.js';
import PresentationManager from '../presentation_manager.js';
import LOGGER from '../logger.js';

const router = express.Router();

// Uploads and converts a presentation and returns a code to be used to connect to the room.
router.post('/create-presentation', async (request, response, next) => {
    // check for empty url parameters
    if (request.query.filename === null) {
        response.json({ status: 400, message: 'Please provide a filename to upload!' });
        return;
    }

    try {
        const code = PresentationManager.createPresentation();

        // upload and convert
        const filename = await uploadPresentation(request, code);
        LOGGER.info(`Presentation uploaded at ${filename}!`);
        const pdfFilename = await convertToPDF(filename);
        LOGGER.info(`Presentation converted to PDF at ${pdfFilename}!`);
        const imageCount = await convertToImages(pdfFilename);
        LOGGER.info(`PDF converted to images in presentations/${code}!`);

        const presentation = PresentationManager.presentations.get(code);
        presentation.count = imageCount;
        presentation.drawingSurfaces = new Array(imageCount).fill(0).map(_ => {
            return { drawables: [], blame: {} };
        });

        // clean up all files
        if (fs.existsSync(filename)) fs.unlinkSync(filename);
        if (fs.existsSync(pdfFilename)) fs.unlinkSync(pdfFilename);

        response.json({ status: 200, message: 'Presentation converted! All done!', data: code });
    } catch (error) {
        response.json(error);
    }
});

// Ends the presentation from code given.
router.post('/end-presentation', async (request, response, next) => {
    // check for empty url parameters
    if (request.query.code === null) {
        response.json({ status: 400, message: 'Please provide the code of the presentation!' });
        return;
    }

    try {
        PresentationManager.endPresentation(request.query.code);

        response.json({ status: 200, message: 'Presentation ended!' });
    } catch (error) {
        response.json(error);
    }
});

export default router;