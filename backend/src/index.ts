import express from 'express'
import * as http from 'http'
import {Server} from 'socket.io'
import {socketRouter} from './router'
import cors from 'cors'

const app = express()
app.use(cors({origin: '*'}))

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
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

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
