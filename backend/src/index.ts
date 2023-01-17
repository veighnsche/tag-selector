import { AxiosError } from 'axios'
import express from 'express'
import { ImageInputsType, SdStatus, SocketEvent } from 'frontend/src/types'
import { GetImagesPathsType } from 'frontend/src/types/image-output'
import * as http from 'http'
import { Server } from 'socket.io'
import { CLIENT_URL, PORT } from './constants'
import { GetImagesPaths, SaveImage } from './utils/crud-image'
import { generateImage } from './utils/generate-image'
import path from 'path'

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
   * listener that generates an image and emits the results back to the client.
   * The image will be saved to the output directory.
   * If there is an error during the generation or saving process, an error event will be emitted.
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
    socket.emit(SocketEvent.IMAGE_OUTPUT, { imageOutput })
    SaveImage(imageOutput)
    .catch((error: Error) => {
      socket.emit(SocketEvent.ERROR, { error })
    })
  })

  socket.on(SocketEvent.FETCH_IMAGES, async (data: GetImagesPathsType) => {
    const images = await GetImagesPaths(data)
    socket.emit(SocketEvent.FETCH_IMAGES, { images })
  })

})

// host output folder
const outputDir = path.join(__dirname, '..', '..', 'outputs')
console.log('outputDir', outputDir)
app.use('/outputs', express.static(outputDir))

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
