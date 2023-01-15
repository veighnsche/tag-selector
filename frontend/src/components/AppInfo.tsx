import {Button} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {useSocket} from './providers/SocketProvider'

interface AppInfoMessage {
  name: string;
  description: string;
  version: string
}

export const AppInfo = () => {
  const {socket} = useSocket()
  const [appInfo, setAppInfo] = useState<AppInfoMessage | null>(null)

  useEffect(() => {
    socket.on('appInfo', (data: AppInfoMessage) => {
      setAppInfo(data)
    })

    return () => {
      socket.off('appInfo')
    }
  }, [socket])

  function requestAppInfo() {
    socket.emit('appInfoRequest')
  }

  return (
    <div>
      <Button onClick={requestAppInfo}>Request App Info</Button>
      {appInfo && <div>
        <p>Name: {appInfo.name}</p>
        <p>Version: {appInfo.version}</p>
        <p>Description: {appInfo.description}</p>
      </div>}
    </div>
  )
}
