import express from 'express'
import * as http from 'http'
import { Server } from 'socket.io'
import { socketRouter } from './router'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
  },
})

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('a user connected')

  socketRouter(socket, io)

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

const PORT = process.env.PORT || 5432
server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
