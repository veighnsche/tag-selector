import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useGenerateImage } from '../../../../hooks/useGenerateImage';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { selectIsPlaying, selectSdStatus, toggleIsPlaying } from '../../../../store/reducers/sdStatus';
import { SdStatus } from '../../../../types';

export const PlayButton = () => {
  const sdStatus = useAppSelector(selectSdStatus);
  const isPlaying = useAppSelector(selectIsPlaying);
  const dispatch = useAppDispatch();
  const generateImage = useGenerateImage();

  useEffect(() => {
    if (sdStatus === SdStatus.READY && isPlaying) {
      generateImage();
    }
  }, [isPlaying, sdStatus]);

  function handleClick() {
    dispatch(toggleIsPlaying());
  }

  return (
    <Button variant="contained" onClick={handleClick}>
      {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
    </Button>
  );
};
