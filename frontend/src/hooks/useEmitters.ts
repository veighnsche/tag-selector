import { useSocket } from '../components/providers/SocketProvider'
import { SocketEvent } from '../types'
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
    }
  }
}