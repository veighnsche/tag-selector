import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { SocketEvent } from '../types'
import { useSocket } from './providers/SocketProvider'

const StyledProgress = styled.progress`
  width: 97vw;
  height: 4px;
  position: fixed;
  z-index: 100;
  margin: 0 1rem;
  border: none;
  transform: translateX(0.25%);
`

export function ProgressBar() {
  const [progress, setProgress] = useState(0)
  const socket = useSocket()

  useEffect(() => {
    socket.on(SocketEvent.PROGRESS_PERCENT, progress => {
      setProgress(progress)
    })

    return () => {
      socket.off(SocketEvent.PROGRESS_PERCENT)
    }
  }, [])

  return <StyledProgress value={progress} max="1"/>
}