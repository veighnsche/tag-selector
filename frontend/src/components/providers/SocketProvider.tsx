import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import socketio, { Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../../store'
import { selectSocketStatus, setSocketStatus, SocketStatus } from '../../store/reducers/socketStatus'
import { SocketEvent } from '../../types'

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
    socket.on(SocketEvent.CONNECT, () => {
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
    socket.on(SocketEvent.DISCONNECT, () => {
      console.log('Disconnected from server')
      dispatch(setSocketStatus(SocketStatus.DISCONNECTED))
    })

    /**
     * Close socket connection on unmount
     */
    return () => {
      socket.off(SocketEvent.CONNECT)
      socket.off(SocketEvent.DISCONNECT)
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
