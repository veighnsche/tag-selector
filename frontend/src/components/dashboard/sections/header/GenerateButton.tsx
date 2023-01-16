import { Button } from '@mui/material'
import { useAppSelector } from '../../../../store'
import { selectScene } from '../../../../store/reducers/inputs'
import { SdStatus, selectSdStatus } from '../../../../store/reducers/sdStatus'
import { useSocket } from '../../../providers/SocketProvider'

export const GenerateButton = () => {
  const {socket} = useSocket()
  const scene = useAppSelector(selectScene)
  const sdStatus = useAppSelector(selectSdStatus)

  function handleClick() {
    console.log(scene)
    socket.emit('generateImage', {scene})
  }

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={sdStatus === SdStatus.BUSY}
    >
      Generate
    </Button>
  )
}
