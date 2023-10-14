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
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

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
     * socket.io server that provide real-time connection
     * 
     * @type {Server}
     */
    static io = null;

    /**
     * Setups up the events and connections needed for real-time connection
     * 
     * @param {Server} io The created server for socket.io
     */
    static setupConnections(io) {
        PresentationManager.io = io;

        PresentationManager.io.on('connection', socket => {
            socket.on('RECONNECT_PRESENTATION', (code, uuid, callback) => {
                const currentPresentation = PresentationManager.presentations.get(code);
                if (currentPresentation == null) {
                    callback({ status: 404, data: null });
                    return;
                }

                if (currentPresentation.connections.has(uuid)) {
                    socket.uuid = uuid;
                    
                    callback({ status: 200, data: null });
                    LOGGER.info(`Client ${socket.uuid} rejoined ${code}!`);
                } else {
                    const newUUID = uuidv4();

                    currentPresentation.connections.add(newUUID);
                    currentPresentation.globalState.pointers.set(newUUID, null);
                    
                    socket.uuid = newUUID;

                    callback({ status: 200, data: newUUID });
                    LOGGER.info(`New client ${socket.uuid} joined ${code}!`);
                }

                socket.join(code);
                socket.emit('GLOBAL_UPDATE', currentPresentation.globalState);
            });
            
            socket.on('JOIN_PRESENTATION', (code, callback) => {
                const newUUID = uuidv4();
                
                const currentPresentation = PresentationManager.presentations.get(code);
                if (currentPresentation == null) {
                    callback({ status: 404, data: null });
                    return;
                }

                currentPresentation.connections.add(newUUID);
                currentPresentation.globalState.pointers.set(newUUID, null);
                
                socket.uuid = newUUID;
                socket.join(code);
                socket.emit('GLOBAL_UPDATE', currentPresentation.globalState);

                callback({ status: 200, data: newUUID });
                LOGGER.info(`New client ${socket.uuid} joined ${code}!`);
            });

            socket.on('SET_SLIDE', (slide, code) => {
                const state = PresentationManager.presentations.get(code).globalState;
                state.currentSlide = slide;
                
                PresentationManager.io.to(code).emit('GLOBAL_UPDATE', state);
            });

            socket.on('disconnect', () => {
                LOGGER.info(`Uh oh ${socket.uuid} left!`);
            });
        });
    }

    /**
     * Generates a code and initializes a Presentation
     * @returns {string} Code of new presentation
     */
    static createPresentation() {
        const code = new Array(4).fill(0).map(_ => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]).join('');

        PresentationManager.presentations.set(code, {
            connections: new Set(),
            globalState: {
                pointers: new Map(),
                drawingSurfaces: [],
                currentSlide: 0,
                count: -1
            }
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