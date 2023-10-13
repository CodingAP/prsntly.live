/**
 * presentation/src/upload.js
 * 
 * The uploading functions for the backend
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import fs from 'fs';
import path from 'path';
import { __dirname } from './common.js';

const uploadPath = path.join(__dirname, 'uploaded', '.raw_presentations');

/**
 * Upload the presentation to the server where it can be processed
 * 
 * @param {Request} request - Request from the router
 * @returns Filename where the uploaded powerpoint is
 */
const uploadPresentation = (request, code) => {
    return new Promise((resolve, reject) => {
        // create upload folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

        const filename = path.join(uploadPath, code + path.extname(request.query.filename));

        // stop any files that are not powerpoints
        const acceptedExtensions = ['.ppt', '.pptx', '.pps', '.ppsx'];
        if (!acceptedExtensions.includes(path.extname(filename))) {
            reject({ status: 400, message: 'Wrong file extension!' });
        }

        // turn request into a file writer to upload files
        const fileWriter = fs.createWriteStream(filename, { flags: 'w' });
        request.pipe(fileWriter);

        fileWriter.on('close', () => {
            resolve(filename);
        });

        fileWriter.on('error', error => {
            reject({ status: 400, message: error });
        });
    });
};

export {
    uploadPresentation
}