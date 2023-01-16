import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import socketio, { Socket } from 'socket.io-client'

interface SocketProviderProps {
  children: ReactNode
}

interface SocketContextProps {
  socket: Socket
  connected: boolean
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5432'

const socket = socketio(SERVER_URL, {
  transports: ['websocket'],
  upgrade: false,
})

const SocketContext = createContext<SocketContextProps>({
  socket,
  connected: false,
})

export const SocketProvider = ({children}: SocketProviderProps) => {
  const [connected, setConnected] = useState(false)
  const [reconnectionTimer, setReconnectionTimer] = useState<NodeJS.Timeout>()

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
      setConnected(true)

      if (reconnectionTimer) {
        clearTimeout(reconnectionTimer)
        setReconnectionTimer(undefined)
      }
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
      setConnected(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // attempt to reconnect if disconnected
  useEffect(() => {
    if (!connected) {
      console.log('Attempting to reconnect with server...')
      const timer = setTimeout(() => {
        socket.connect()
      }, 5000)

      setReconnectionTimer(timer)
    }
  }, [connected])

  return (
    <SocketContext.Provider value={{socket, connected}}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
