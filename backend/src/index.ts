import {AxiosError} from 'axios'
import express from 'express'
import { ImageInputsType, SdStatus, SocketEvent } from 'frontend/src/types'
import * as http from 'http'
import {Server} from 'socket.io'
import {CLIENT_URL, PORT} from './constants'
import {generateImage} from './utils/generate-image'
import {SaveImageToOutputs} from './utils/save-image-to-outputs'

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

  /**
   * @description Generate image from text
   */
  socket.on(SocketEvent.GENERATE_IMAGE, async (reqData: { inputs: ImageInputsType }) => {
    socket.emit(SocketEvent.SD_STATUS, SdStatus.BUSY)
    const imageOutput = await generateImage(reqData.inputs)
      .catch((error: AxiosError) => {
        socket.emit(SocketEvent.SD_STATUS, SdStatus.ERROR)
        socket.emit(SocketEvent.ERROR, {error})
      })

    if (!imageOutput) return

    socket.emit(SocketEvent.SD_STATUS, SdStatus.READY)
    socket.emit(SocketEvent.IMAGE_OUTPUT, {imageOutput})
    SaveImageToOutputs(imageOutput)
      .catch((error: Error) => {
        socket.emit(SocketEvent.ERROR, {error})
      })
  })


})
server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
