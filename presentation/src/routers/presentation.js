/**
 * presentation/src/routers/main.js
 * 
 * The router that hosts directs the presentation requests to the correct place.
 * 
 * Here are the paths:
 * '/presentations/:code' - Gets the information needed for the presentation
 * '/presentations/:code/:image' - Gets the specific image from presentation
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import express from 'express';
import path from 'path';
import PresentationManager from '../presentation_manager.js';
import { __dirname } from '../common.js';

const router = express.Router();

// Returns the information for a presentation
router.get('/:code', async (request, response, next) => {
    if (PresentationManager.presentations.has(request.params.code)) {
        response.status(200);
        response.json(PresentationManager.presentations.get(request.params.code).globalState);
    } else {
        response.status(404);
        response.send('Presentation not found!')
    }
});

// Returns the image of a slide from a presentation
router.get('/:code/:id', async (request, response, next) => {
    const presentation = PresentationManager.presentations.get(request.params.code).globalState;
    if (presentation !== undefined) {
        const id = parseInt(request.params.id);
        if (id !== NaN && id > 0 && id <= presentation.count) {
            // send image
            response.sendFile(`${id}.jpg`, {
                root: path.join(__dirname, 'uploaded', 'presentations', request.params.code),
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true,
                    'content-type': 'image/jpeg'
                }
            });
        } else {
            response.status(404);
            response.send('Presentation slide not found!');
        }
    } else {
        response.status(404);
        response.send('Presentation not found!');
    }
});

export default router;