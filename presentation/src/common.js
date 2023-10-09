/**
 * presentation/src/common.js
 * 
 * Common variables and functions needed throughout the project
 * 
 * by Alex Prosser
 * 10/8/2023
 */

import path from 'path';
import { fileURLToPath } from 'url';

/** 
 * Full file path of the presentation/ directory
 */
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Sends a file to the client
 * 
 * @param {string} file Filename of the file to send to client 
 * @param {Express.Response} response Response from the router
 */
const sendFile = (file, response) => {
    response.sendFile(file, {
        root: path.join(__dirname, 'public'),
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    });
}

export {
    sendFile,
    __dirname
}