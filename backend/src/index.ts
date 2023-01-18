import express from 'express'
import { SocketEvent } from 'frontend/src/types'
import * as http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import { CLIENT_URL, PORT } from './constants'
import { fetchImageController, removeImageController } from './listeners/crud-image.controller'
import { generateImageController } from './listeners/generate-image.controller'
import {
  fetchOptionsController,
  fetchSamplingMethodsController,
  fetchSdModelsController,
  setOptionsController,
} from './listeners/sd-options.controller'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
})

// Socket.io event handling
io.on(SocketEvent.CONNECT, (socket) => {
  console.log('a user connected')
  socket.on(SocketEvent.DISCONNECT, () => {
    console.log('user disconnected')
  })

  socket.on(SocketEvent.GENERATE_IMAGE, generateImageController(socket))
  socket.on(SocketEvent.FETCH_IMAGES, fetchImageController(socket))
  socket.on(SocketEvent.REMOVE_IMAGE, removeImageController(socket))
  socket.on(SocketEvent.FETCH_SD_MODELS, fetchSdModelsController(socket))
  socket.on(SocketEvent.FETCH_SD_OPTIONS, fetchOptionsController(socket))
  socket.on(SocketEvent.SET_SD_OPTIONS, setOptionsController(socket))
  socket.on(SocketEvent.FETCH_SAMPLERS, fetchSamplingMethodsController(socket))
})

// host output folder
const outputDir = path.join(__dirname, '..', '..', 'outputs')
app.use('/outputs', express.static(outputDir))

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
