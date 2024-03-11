import SkipNextIcon from '@mui/icons-material/SkipNext';
import StopIcon from '@mui/icons-material/Stop';
import { Button } from '@mui/material';
import { useEmitters } from '../../../../hooks/useEmitters';
import { useAppSelector } from '../../../../store';
import { selectIsPlaying, selectSdStatus } from '../../../../store/reducers/sdStatus';
import { SdStatus } from '../../../../types';

export const StopOrSkipButton = () => {
  const isPlaying = useAppSelector(selectIsPlaying);
  const sdStatus = useAppSelector(selectSdStatus);
  const emit = useEmitters();

  function handleClick() {
    emit.generateImageInterrupt();
  }

  return (
    <Button
      variant="contained"
      disabled={sdStatus === SdStatus.READY}
      onClick={handleClick}
      color={isPlaying ? 'warning' : 'error'}
    >
      {isPlaying ? <SkipNextIcon /> : <StopIcon />}
    </Button>
  );
};
