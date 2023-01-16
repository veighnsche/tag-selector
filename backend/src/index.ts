import { AxiosError } from 'axios'
import express from 'express'
import * as http from 'http'
import { Server } from 'socket.io'
import { CLIENT_URL, PORT } from './constants'
import { generateImage } from './utils/generate-image'
import type { GenerateImageType } from './utils/generate-image'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
})

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('generateImageRequest', (reqData: GenerateImageType) => {
    generateImage(reqData)
    .then(resData => {
      socket.emit('generateImage', resData)
    })
    .catch((error: AxiosError) => {
      socket.emit('error', error)
    })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
