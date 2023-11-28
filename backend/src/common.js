/**
 * presentation/src/common.js
 * 
 * Common variables and functions needed throughout the project
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import path from 'path';
import { fileURLToPath } from 'url';

/** 
 * Full file path of the presentation/ directory
 */
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export {
    __dirname
}