/**
 * presentation/index.js
 * 
 * The main server for the backend prototype.
 * Just a simple Express server that shows a main presentation screen
 * and handles all the API calls
 * 
 * '/': presentation/src/routers/main.js
 * '/api': presentation/src/routers/api.js
 * '/presentations': presentation/src/routers/presentation.js
 * 
 * by Alex Prosser
 * 10/13/2023
 */

import fs from 'fs';
import http from 'http';
import path from 'path';
import 'dotenv/config';
import express from 'express';
import { Server } from 'socket.io';

import { __dirname } from './src/common.js';
import LOGGER from './src/logger.js';
import apiRouter from './src/routers/api.js';
import mainRouter from './src/routers/main.js';
import presentationRouter from './src/routers/presentation.js';
import PresentationManager from './src/presentation_manager.js';

const app = express();
const server = http.createServer(app);
const PORT = 1337 || process.env.PORT;

PresentationManager.setupConnections(new Server(server));

// clean up uploaded files
const uploadDirectory = path.join(__dirname, 'uploaded');
if (fs.existsSync(uploadDirectory)) {
    fs.readdirSync(uploadDirectory, { recursive: true }).forEach(name => {
        const filename = path.join(uploadDirectory, name);
        if (fs.statSync(filename).isDirectory()) {
            fs.rmSync(filename, { recursive: true, force: true });
        } else {
            fs.unlinkSync(filename);
        }
    });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', mainRouter);
app.use('/api', apiRouter);
app.use('/presentations', presentationRouter);

server.listen(PORT, () => {
    LOGGER.info(`prsntly.live listening on port ${PORT}`);
});

const exitSafely = () => {
    LOGGER.info('Closing prsntly.live server...\n');
    process.exit(1);
}

['SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'].forEach(eventType => {
    process.on(eventType, exitSafely.bind(null, eventType));
});