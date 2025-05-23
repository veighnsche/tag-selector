import express from 'express';
import { SocketEvent } from 'frontend/src/types';
import * as http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { CLIENT_URL, PORT } from './constants';
import { fetchImageController, removeImageController } from './controllers/image-crud.controller';
import { fetchImageDataController } from './controllers/image-data.controller';
import { generateImageInterruptController, imageGenerateController } from './controllers/image-generate.controller';
import { llmCompletionController } from './controllers/llm-completion.controller';
import {
  fetchOptimizersController,
  fetchOptionsController,
  fetchSamplingMethodsController,
  fetchSdModelsController,
  fetchUpscalersController,
  fetchVeasController,
  setOptionsController,
} from './controllers/sd-options.controller';
import './db-init';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

// Socket.io event handling
io.on(SocketEvent.CONNECT, (socket) => {
  console.info('a user connected');

  socket.on(SocketEvent.GENERATE_IMAGE, imageGenerateController(socket));
  socket.on(SocketEvent.FETCH_IMAGES, fetchImageController(socket));
  socket.on(SocketEvent.FETCH_IMAGES_MODAL, fetchImageController(socket, { isModal: true }));
  socket.on(SocketEvent.REMOVE_IMAGE, removeImageController(socket));
  socket.on(SocketEvent.FETCH_SD_MODELS, fetchSdModelsController(socket));
  socket.on(SocketEvent.FETCH_SD_OPTIONS, fetchOptionsController(socket));
  socket.on(SocketEvent.SET_SD_OPTIONS, setOptionsController(socket));
  socket.on(SocketEvent.FETCH_SAMPLERS, fetchSamplingMethodsController(socket));
  socket.on(SocketEvent.FETCH_UPSCALERS, fetchUpscalersController(socket));
  socket.on(SocketEvent.FETCH_IMAGE_DATA, fetchImageDataController(socket));
  socket.on(SocketEvent.GENERATE_IMAGE_INTERRUPT, generateImageInterruptController(socket));
  socket.on(SocketEvent.FETCH_OPTIMIZERS, fetchOptimizersController(socket));
  socket.on(SocketEvent.FETCH_VAES, fetchVeasController(socket));
  socket.on(SocketEvent.LLM_COMPLETION, llmCompletionController(socket));

  socket.on(SocketEvent.DISCONNECT, () => {
    console.info('user disconnected');
  });
});

// host output folder
const outputDir = path.join(__dirname, '..', '..', 'outputs');
app.use('/outputs', express.static(outputDir));


server.listen(PORT, () => console.info(`Server started on port ${PORT}`));
