import BurstModeIcon from '@mui/icons-material/BurstMode'
import { Button } from '@mui/material'
import { useEmitters } from '../../hooks/useEmitters'
import { useAppSelector } from '../../store'
import { selectImages } from '../../store/reducers/images'
import { GetImagesPathsType } from '../../types/image-output'

export const FetchImagesButton = () => {
  const images = useAppSelector(selectImages)
  const emit = useEmitters()

  const handleClick = () => {
    // get last image name
    const lastImage = images[images.length - 1]
    const lastImageSplitSlash = lastImage.split('/')
    const lastImageNumber = Number(lastImageSplitSlash[lastImageSplitSlash.length - 1].split('-')[0])

    const params: GetImagesPathsType = {
      amount: 15,
      toIndex: lastImageNumber,
    }

    emit.fetchImages(params)
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
