/**
 * presentation/src/convert.js
 * 
 * The converting functions for the backend 
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import fs from 'fs';
import path from 'path';
import { __dirname } from './common.js';
import { exec } from 'child_process';

const uploadPath = path.join(__dirname, 'uploaded');

/**
 * Converts uploaded presentation to PDF
 * 
 * @param {string} pathname Filename of powerpoint to convert 
 * @returns {Promise<string>} Filename of converted PDF
 */
const convertToPDF = pathname => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(pathname)) {
            reject({ status: 500, message: 'File was not found on server!' });
        }

        // create output folder if it doesn't exist
        const outputDirectory = path.join(uploadPath, '.pdf_presentations');
        if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory, { recursive: true });

        // uses LibreOffice command line to convert powerpoint to pdf
        exec(`"${process.env.PPT_TO_PDF_PATH}" --headless --convert-to pdf --outdir "${outputDirectory}" "${pathname}"`, (err, stdout, stderr) => {
            if (err) reject({ status: 500, message: err });
            resolve(path.join(outputDirectory, path.parse(pathname).name + '.pdf'));
        });
    });
}

/**
 * Converts PDF to array of images
 * 
 * @param {string} pathname Filename of PDF to convert
 * @returns {Promise<number>} Count of how many slides there are
 */
const convertToImages = (pathname) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(pathname)) {
            reject({ status: 500, message: 'File was not found on server!' });
        }

        // get number of pages
        getPDFPages(pathname).then(response => {
            const code = path.parse(pathname).name;

            // create output folder if it doesn't exist
            const outputDirectory = path.join(uploadPath, 'presentations', code);
            if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory, { recursive: true });

            // uses GhostScript command line to convert pdf to list of images
            exec(`"${process.env.GS_PATH}" -dBATCH -dNOPAUSE -sDEVICE=jpeg -dJPEGQ=75 -r300 -sOutputFile="${outputDirectory}/%d.jpg" "${pathname}"`, (err, stdout, stderr) => {
                if (err) reject({ status: 500, message: stderr });
                resolve(response);
            });
        });
    });
}

/**
 * Gets the number of pages in a PDF file 
 * 
 * @param {string} pdfFile Filename of PDF to convert
 * @returns {Promise<number>} Number of pages in PDF
 */
const getPDFPages = pdfFile => {
    return new Promise((resolve, reject) => {
        // uses cpdf.exe to get how many pages are in PDF
        exec(`"${process.env.CPDF_PATH}" -pages "${pdfFile}"`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(parseInt(stdout));
        });
    });
}

export {
    convertToPDF,
    convertToImages
};