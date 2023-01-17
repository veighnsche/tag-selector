import BurstModeIcon from '@mui/icons-material/BurstMode'
import { Button } from '@mui/material'
import { useAppSelector } from '../../store'
import { selectImages } from '../../store/reducers/images'
import { SocketEvent } from '../../types'
import { GetImagesPathsType } from '../../types/image-output'
import { useSocket } from '../providers/SocketProvider'

export const FetchImagesButton = () => {
  const socket = useSocket()
  const images = useAppSelector(selectImages)

  const handleClick = () => {
    // get last image name
    const lastImageSplitSlash = images[images.length - 1].split('/')
    const lastImageNumber = Number(lastImageSplitSlash[lastImageSplitSlash.length - 1].split('-')[0])

    const params: GetImagesPathsType = {
      amount: 15,
      toIndex: lastImageNumber,
    }

    socket.emit(SocketEvent.FETCH_IMAGES, params)
  }

  // button with icon
  return (
    <Button
      onClick={handleClick}
      fullWidth
      size="large"
      variant="outlined"
      color="primary"
      startIcon={<BurstModeIcon/>}
    >
      Fetch images
    </Button>
  )
}