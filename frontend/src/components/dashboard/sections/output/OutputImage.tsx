import {useEffect} from 'react'
import {useSocket} from '../../../providers/SocketProvider'

export const OutputImage = () => {
  const {socket} = useSocket()

  useEffect(() => {
    socket.on('generateImageResponse', (data) => {
      console.log(data)
    })
  })

  return null;
}
