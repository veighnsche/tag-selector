import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import socketio, { Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../../store'
import { SdStatus, setSdStatus } from '../../store/reducers/sdStatus'
import { selectSocketStatus, setSocketStatus, SocketStatus } from '../../store/reducers/socketStatus'

interface SocketProviderProps {
  children: ReactNode
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5432'

const socket = socketio(SERVER_URL, {
  transports: ['websocket'],
  upgrade: false,
})

const SocketContext = createContext<Socket>(socket)

export const SocketProvider = ({children}: SocketProviderProps) => {
  const [reconnectionTimer, setReconnectionTimer] = useState<NodeJS.Timeout>()
  const dispatch = useAppDispatch()
  const socketStatus = useAppSelector(selectSocketStatus)

  useEffect(() => {
    /**
     * Socket connection event
     */
    socket.on('connect', () => {
      console.log('Connected to server')
      dispatch(setSocketStatus(SocketStatus.CONNECTED))

      if (reconnectionTimer) {
        clearTimeout(reconnectionTimer)
        setReconnectionTimer(undefined)
      }
    })

    /**
     * Socket disconnection event
     */
    socket.on('disconnect', () => {
      console.log('Disconnected from server')
      dispatch(setSocketStatus(SocketStatus.DISCONNECTED))
    })

    /**
     * Sd status event
     */
    socket.on('sdStatus', (status: SdStatus ) => {
      dispatch(setSdStatus(status))
    })

    /**
     * Close socket connection on unmount
     */
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('sdStatus')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // attempt to reconnect if disconnected
  useEffect(() => {
    if (socketStatus === SocketStatus.DISCONNECTED) {
      console.log('Attempting to reconnect with server...')
      const timer = setTimeout(() => {
        socket.connect()
      }, 5000)

      setReconnectionTimer(timer)
    }
  }, [socketStatus])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
