import { ImageDataRequestType } from 'frontend/src/types/image-data'
import { SocketEvent } from 'frontend/src/types/socket-event'
import { Socket } from 'socket.io'
import { fetchImageData } from './image-data'

export function fetchImageDataController(socket: Socket) {
  return ({ fileIndex, ...imageDataRequest }: ImageDataRequestType) => {
    fetchImageData({ fileIndex, ...imageDataRequest })
      .then((imageData) => {
        socket.emit(`${SocketEvent.FETCH_IMAGE_DATA}-${fileIndex}`, { imageData })
      })
      .catch((error: Error) => {
        socket.emit(SocketEvent.ERROR, { error })
      })
  }
}