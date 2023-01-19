import { useSocket } from '../components/providers/SocketProvider'
import { SocketEvent } from '../types'
import { ImageDataRequestType } from '../types/image-data'
import { GetImagesPathsType } from '../types/image-output'
import { SdOptionsType } from '../types/sd-options'

export function useEmitters() {
  const socket = useSocket()

  return {
    setSdOptions: (options: Partial<SdOptionsType>) => {
      socket.emit(SocketEvent.SET_SD_OPTIONS, { options })
    },
    fetchSdModels: () => {
      socket.emit(SocketEvent.FETCH_SD_MODELS)
    },
    fetchSamplingMethods: () => {
      socket.emit(SocketEvent.FETCH_SAMPLERS)
    },
    removeImage: (fileName: string) => {
      socket.emit(SocketEvent.REMOVE_IMAGE, { fileName })
    },
    fetchImageData: (image: ImageDataRequestType) => {
      socket.emit(SocketEvent.FETCH_IMAGE_DATA, image)
    },
    fetchImages: (params: GetImagesPathsType) => {
      socket.emit(SocketEvent.FETCH_IMAGES, params)
    }
  }
}
