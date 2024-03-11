import { Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useEmitters } from '../../../../hooks/useEmitters';
import { useAppSelector } from '../../../../store';
import { selectSteps } from '../../../../store/reducers/inputs';
import { selectCurrentClipSkip } from '../../../../store/reducers/sdOptions';
import { SliderControl, SliderLabel, SliderTextField, SliderTextWrapper } from '../../../styled/Slider';

export const ClipSkipSlider = () => {
  const currentClipSkip = useAppSelector(selectCurrentClipSkip);
  const currentSteps = useAppSelector(selectSteps);
  const [clipSkip, setClipSkip] = useState<number>(currentClipSkip);
  const emit = useEmitters();

  useEffect(() => {
    if (clipSkip === currentClipSkip) return;

    const timeout = setTimeout(() => {
      emit.setSdOptions({ CLIP_stop_at_last_layers: clipSkip });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [clipSkip]);

  useEffect(() => {
    if (clipSkip > currentSteps) {
      setClipSkip(currentSteps);
    }
  }, [currentSteps]);

  return (
    <SliderControl>
      <SliderTextWrapper>
        <SliderLabel size="small">Clip skip</SliderLabel>
        <SliderTextField
          type="number"
          size="small"
          variant="standard"
          value={clipSkip}
          onChange={(e) => {
            setClipSkip(Number(e.target.value));
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </SliderTextWrapper>
      <Slider
        min={1}
        max={currentSteps}
        size="small"
        value={clipSkip}
        onChange={(e, value) => {
          setClipSkip(Number(value));
        }}
      />
    </SliderControl>
  );
};
