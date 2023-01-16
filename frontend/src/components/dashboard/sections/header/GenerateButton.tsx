import { Button } from '@mui/material'
import { useAppSelector } from '../../../../store'
import { selectScene } from '../../../../store/reducers/inputs'
import { useSocket } from '../../../providers/SocketProvider'

export const GenerateButton = () => {
  const {socket} = useSocket()
  const scene = useAppSelector(selectScene)

  function handleClick() {
    console.log(scene)
    socket.emit('generateImageRequest', {scene})
  }

  return (
    <Button
      variant="contained"
      onClick={handleClick}
    >
      Generate
    </Button>
  )
}
