import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Button } from '@mui/material'
import { useGenerateImage } from '../../../../hooks/useGenerateImage'
import { useAppDispatch, useAppSelector } from '../../../../store'
import { selectIsPlaying, selectSdStatus, toggleIsPlaying } from '../../../../store/reducers/sdStatus'
import { SdStatus } from '../../../../types'

export const PlayButton = () => {
  const sdStatus = useAppSelector(selectSdStatus)
  const isPlaying = useAppSelector(selectIsPlaying)
  const dispatch = useAppDispatch()
  const generateImage = useGenerateImage()

  function handleClick() {
    dispatch(toggleIsPlaying())
    if (sdStatus === SdStatus.READY) {
      generateImage()
    }
  }

  return (
    <Button
      variant="contained"
      onClick={handleClick}
    >
      {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
    </Button>
  )
}