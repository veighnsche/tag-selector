import { AxiosError } from 'axios'
import { ImageInputsType } from 'frontend/src/types/image-input'
import { SdStatus } from 'frontend/src/types/sd-status'
import { SocketEvent } from 'frontend/src/types/socket-event'
import { Socket } from 'socket.io'
import { getNextIndex, saveImages } from './crud-image'
import { generateImage } from './generate-image'

export function generateImageController(socket: Socket) {
  return async (reqData: { inputs: ImageInputsType }) => {
    socket.emit(SocketEvent.SD_STATUS, SdStatus.BUSY)
    const nextIndexPromise = getNextIndex()
    const imageOutput = await generateImage(reqData.inputs)
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.SD_STATUS, SdStatus.ERROR)
      socket.emit(SocketEvent.ERROR, { error })
    })

    if (!imageOutput) return

    socket.emit(SocketEvent.SD_STATUS, SdStatus.READY)

    const nextIndex = await nextIndexPromise
    const images = await saveImages(imageOutput, nextIndex)
    .catch((error: Error) => {
      socket.emit(SocketEvent.ERROR, { error })
    })
    socket.emit(SocketEvent.IMAGE_OUTPUT, { imageOutput, images })
  }
}