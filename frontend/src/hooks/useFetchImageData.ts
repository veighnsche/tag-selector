import { useSocket } from '../components/providers/SocketProvider'
import { useAppDispatch, useAppSelector } from '../store'
import { selectImageData, setImageData } from '../store/reducers/images'
import { SocketEvent } from '../types'
import { ImageDataType } from '../types/image-data'
import { extractFileIndex, prefixWithImageUrl } from '../utils/files'
import { useEmitters } from './useEmitters'

export function useFetchImageData() {
  const socket = useSocket()
  const dataSelector = useAppSelector(selectImageData)
  const dispatch = useAppDispatch()
  const emit = useEmitters()

  return (filename: string): Promise<ImageDataType> => {
    const imageData = dataSelector(filename)
    if (imageData) {
      return Promise.resolve(imageData)
    }

    const fileIndex = extractFileIndex(filename)

    return new Promise(resolve => {
      socket.on(`${SocketEvent.FETCH_IMAGE_DATA}-${fileIndex}`, ({ imageData }: { imageData: ImageDataType }) => {
        socket.off(`${SocketEvent.FETCH_IMAGE_DATA}-${fileIndex}`)
        dispatch(setImageData({ filename, imageData }))
        resolve(imageData)
      })

      emit.fetchImageData({
        fileName: filename,
        fileIndex,
        filePath: prefixWithImageUrl(filename),
      })
    })
  }
}
