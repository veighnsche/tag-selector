import { ImageDataRequestType } from 'frontend/src/types/image-data'
import { SocketEvent } from 'frontend/src/types/socket-event'
import { Socket } from 'socket.io'
import { fetchImageData } from './image-data'
import { fetchMetaDataFromImage } from './image-metadata'

export function fetchImageDataController(socket: Socket) {
  return async ({ fileIndex, filePath, fileName }: ImageDataRequestType) => {
    const imageData = await fetchImageData(filePath)
    .catch((error: Error) => {
      socket.emit(SocketEvent.ERROR, { error })
    })

    const metadata = await fetchMetaDataFromImage(fileName)

    socket.emit(`${SocketEvent.FETCH_IMAGE_DATA}-${fileIndex}`, {
      imageData,
      tagSelectorData: metadata
    })
  }
}