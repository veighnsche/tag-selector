import { AxiosError } from 'axios'
import { ImageInputsType } from 'frontend/src/types/image-input'
import { SdStatus } from 'frontend/src/types/sd-status'
import { SocketEvent } from 'frontend/src/types/socket-event'
import { Socket } from 'socket.io'
import { getNextIndex, saveImages } from './image-crud'
import { getProgress, imageGenerate } from './image-generate'

export function imageGenerateController(socket: Socket) {
  return async (reqData: { inputs: ImageInputsType }) => {
    socket.emit(SocketEvent.SD_STATUS, SdStatus.BUSY)
    const nextIndexPromise = getNextIndex()

    const progressInterval = setInterval(async () => {
      const progress = await getProgress()
      socket.emit(SocketEvent.PROGRESS, progress)
    }, 800)

    const imageOutput = await imageGenerate(reqData.inputs)
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.SD_STATUS, SdStatus.ERROR)
      socket.emit(SocketEvent.ERROR, { error })
    })

    clearInterval(progressInterval)

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
