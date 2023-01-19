import { ReactNode, useEffect } from 'react'
import { useEffectOnce } from '../../hooks/useEffectOnce'
import { useGenerateImage } from '../../hooks/useGenerateImage'
import { useAppDispatch, useAppSelector } from '../../store'
import { setSdOptions } from '../../store/reducers/sdOptions'
import { selectIsPlaying, setSdStatus } from '../../store/reducers/sdStatus'
import { SdStatus, SocketEvent } from '../../types'
import { useSocket } from './SocketProvider'

interface SdOptionsProviderProps {
  children: ReactNode;
}

export const SdOptionsProvider = ({ children }: SdOptionsProviderProps) => {
  const socket = useSocket()
  const dispatch = useAppDispatch()
  const isPlaying = useAppSelector(selectIsPlaying)
  const generateImage = useGenerateImage()

  useEffectOnce(() => {
    socket.emit(SocketEvent.FETCH_SD_OPTIONS)
  })

  useEffect(() => {
    socket.on(SocketEvent.SD_STATUS, (status: SdStatus ) => {
      dispatch(setSdStatus(status))
      if (isPlaying && status === SdStatus.READY) {
        generateImage()
      }
    })

    socket.on(SocketEvent.FETCH_SD_OPTIONS, ({ options }: { options: any }) => {
      dispatch(setSdOptions({ options }))
    })

    return () => {
      socket.off(SocketEvent.SD_STATUS)
      socket.off(SocketEvent.FETCH_SD_OPTIONS)
    }
  }, [isPlaying])



  return (
    <>
      {children}
    </>
  )
}