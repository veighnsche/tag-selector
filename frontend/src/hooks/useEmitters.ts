import { useSocket } from '../components/providers/SocketProvider'
import { ImageInputsType, SocketEvent } from '../types'
import { ImageDataRequestType } from '../types/image-data'
import { PromptTagsType } from '../types/image-input'
import { GetImagesPathsType } from '../types/image-output'
import { SdOptionsType } from '../types/sd-options'

export function useEmitters() {
  const socket = useSocket()

  return {
    fetchImageData: (image: ImageDataRequestType) => {
      socket.emit(SocketEvent.FETCH_IMAGE_DATA, image)
    },
    fetchImages: (params: GetImagesPathsType) => {
      socket.emit(SocketEvent.FETCH_IMAGES, params)
    },
    fetchImagesModal: (params: GetImagesPathsType) => {
      socket.emit(SocketEvent.FETCH_IMAGES_MODAL, params)
    },
    fetchSamplingMethods: () => {
      socket.emit(SocketEvent.FETCH_SAMPLERS)
    },
    fetchSdModels: () => {
      socket.emit(SocketEvent.FETCH_SD_MODELS)
    },
    fetchSdOptions: () => {
      socket.emit(SocketEvent.FETCH_SD_OPTIONS)
    },
    generateImage: (inputs: ImageInputsType, tags: PromptTagsType) => {
      // tags are also being emitted to be saved in the image metadata
      socket.emit(SocketEvent.GENERATE_IMAGE, { inputs, tags })
    },
    generateImageInterrupt: () => {
      socket.emit(SocketEvent.GENERATE_IMAGE_INTERRUPT)
    },
    removeImage: (fileName: string) => {
      socket.emit(SocketEvent.REMOVE_IMAGE, { fileName })
    },
    setSdOptions: (options: Partial<SdOptionsType>) => {
      socket.emit(SocketEvent.SET_SD_OPTIONS, { options })
    },
    fetchOptimizers: () => {
      socket.emit(SocketEvent.FETCH_OPTIMIZERS)
    }
  }
}
