/**
 * presentation/src/presentation_manager.js
 * 
 * The main storage of current presentations running
 * Holds all presentations and global states
 * Handles all real time connection stuff
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import fs from 'fs';
import path from 'path';
import LOGGER from './logger.js';
import { __dirname } from './common.js';
import * as Types from './types.js'

/**
 * Class that manages create, destroying, and connecting to presentations
 */
class PresentationManager {
    /**
     * Map of all active presentations
     * 
     * @type {Map<string, Types.Presentation>}
     */
    static presentations = new Map();

    /**
     * Generates a code and initializes a Presentation
     * @returns {string} Code of new presentation
     */
    static createPresentation() {
        const code = new Array(4).fill(0).map(_ => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]).join('');

        PresentationManager.presentations.set(code, {
            pointers: new Map(),
            drawingSurfaces: [],
            currentSlide: 0,
            count: -1
        });

        LOGGER.info(`Created new Presentation with code ${code}`);

        return code;
    }

    /**
     * Cleans up the files and deletes presentation from memory
     * @param {string} code Code of the presentation
     */
    static endPresentation(code) {
        const deleted = PresentationManager.presentations.delete(code);

        if (!deleted) {
            throw new Error({ status: 404, message: 'Not Found!' });
        }

        LOGGER.info(`Ended Presentation with code ${code}`);

        // clean up images
        const presentationDirectory = path.join(__dirname, 'uploaded', 'presentations', code);
        if (fs.existsSync(presentationDirectory)) {
            fs.rmSync(presentationDirectory, { recursive: true, force: true });
        }
    }
}

export default PresentationManager;