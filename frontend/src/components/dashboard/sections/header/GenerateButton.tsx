import { Button } from '@mui/material'
import { useGenerateImage } from '../../../../hooks/useGenerateImage'
import { useAppSelector } from '../../../../store'
import { SdStatus, selectSdStatus } from '../../../../store/reducers/sdStatus'

export const GenerateButton = () => {
  const sdStatus = useAppSelector(selectSdStatus)
  const generateImage = useGenerateImage()

  function handleClick() {
    generateImage()
  }

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={sdStatus === SdStatus.BUSY}
    >
      Generate one
    </Button>
  )
}
