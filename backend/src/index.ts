import { AxiosError } from 'axios'
import express from 'express'
import * as http from 'http'
import { Server } from 'socket.io'
import { CLIENT_URL, PORT } from './constants'
import { generateImage, InputsState } from './utils/generate-image'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
})

enum SdStatus {
  READY = 'READY',
  BUSY = 'BUSY',
  ERROR = 'ERROR',
}

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  /**
   * @description Generate image from text
   */
  socket.on('generateImage', (reqData: { inputs: InputsState }) => {
    socket.emit('sdStatus', SdStatus.BUSY)
    generateImage(reqData.inputs)
    .then(resData => {
      socket.emit('sdStatus', SdStatus.READY)
      socket.emit('generateImage', { data: resData })
    })
    .catch((error: AxiosError) => {
      socket.emit('sdStatus', SdStatus.ERROR)
      socket.emit('error', { error })
    })
  })


})
server.listen(PORT, () => console.log(`Server started on port ${PORT}`))