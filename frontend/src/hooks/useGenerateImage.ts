import { useSocket } from '../components/providers/SocketProvider'
import { useAppSelector } from '../store'
import { selectInputs } from '../store/reducers/inputs'
import { selectSdStatus } from '../store/reducers/sdStatus'
import { SdStatus, SocketEvent } from '../types'

export function useGenerateImage() {
  const socket = useSocket()
  const inputs = useAppSelector(selectInputs)
  const sdStatus = useAppSelector(selectSdStatus)

  return () => {
    if (sdStatus === SdStatus.READY) {
      socket.emit(SocketEvent.GENERATE_IMAGE, { inputs })
    }
  }
}
