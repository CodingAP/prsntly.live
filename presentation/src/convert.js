/**
 * presentation/src/convert.js
 * 
 * The converting functions for the backend 
 * 
 * by Alex Prosser
 * 10/8/2023
 */

import fs from 'fs';
import path from 'path';
import { __dirname } from './common.js';
import { exec } from 'child_process';

const uploadPath = path.join(__dirname, 'uploaded');

/**
 * Converts uploaded presentation to PDF
 * 
 * @param {string} path Filename of powerpoint to convert 
 * @returns Filename of converted PDF
 */
const convertToPDF = path => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            reject({ status: 500, message: 'File was not found on server!' });
        }

        const outputDirectory = path.join(uploadPath, 'pdf_presentations');

        // uses LibreOffice command line to convert powerpoint to pdf
        exec(`"${process.env.PPT_TO_PDF_PATH}" --headless --convert-to pdf --outdir "${outputDirectory}" "${filename}"`, (err, stdout, stderr) => {
            if (err) reject({ status: 500, message: err });
            resolve(path.join(outputDirectory, path.parse(path).name + '.pdf'));
        });
    });
}

/**
 * Converts PDF to array of images
 * IMCOMPLETE
 * 
 * @param {string} path Filename of PDF to convert 
 * @returns List of images' paths
 */
const convertToImages = path => {
    return new Promise((resolve, reject) => {
        resolve(path);
    });
}

export {
    convertToPDF,
    convertToImages
};