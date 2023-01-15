import express from 'express'
import * as http from 'http'
import {Server} from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('message', (msg) => {
    console.log('message: ' + msg)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
