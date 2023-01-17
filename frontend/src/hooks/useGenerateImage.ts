
import { useSocket } from '../components/providers/SocketProvider'
import { useAppSelector } from '../store'
import { selectInputs } from '../store/reducers/inputs'
import { SocketEvent } from '../types'

export function useGenerateImage() {
  const socket = useSocket()
  const inputs = useAppSelector(selectInputs)

  return () => {
    socket.emit(SocketEvent.GENERATE_IMAGE, { inputs })
  }
}
