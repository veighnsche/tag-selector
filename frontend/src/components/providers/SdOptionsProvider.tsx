import { ReactNode, useEffect } from 'react'
import { useEffectOnce } from '../../hooks/useEffectOnce'
import { useAppDispatch } from '../../store'
import { setSdOptions } from '../../store/reducers/sdOptions'
import { setSdStatus } from '../../store/reducers/sdStatus'
import { SdStatus, SocketEvent } from '../../types'
import { useSocket } from './SocketProvider'

interface SdOptionsProviderProps {
  children: ReactNode;
}

export const SdOptionsProvider = ({ children }: SdOptionsProviderProps) => {
  const socket = useSocket()
  const dispatch = useAppDispatch()

  useEffectOnce(() => {
    socket.emit(SocketEvent.FETCH_SD_OPTIONS)
  })

  useEffect(() => {
    socket.on(SocketEvent.SD_STATUS, (status: SdStatus ) => {
      dispatch(setSdStatus(status))
    })

    socket.on(SocketEvent.FETCH_SD_OPTIONS, ({ options }: { options: any }) => {
      console.log("options", options)
      dispatch(setSdOptions({ options }))
    })

    return () => {
      socket.off(SocketEvent.SD_STATUS)
      socket.off(SocketEvent.FETCH_SD_OPTIONS)
    }
  })



  return (
    <>
      {children}
    </>
  )
}