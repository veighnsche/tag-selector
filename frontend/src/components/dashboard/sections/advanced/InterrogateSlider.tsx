import { Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useEmitters } from '../../../../hooks/useEmitters';
import { useAppSelector } from '../../../../store';
import { selectCurrentTagScanThreshold } from '../../../../store/reducers/sdOptions';
import { SliderControl, SliderLabel, SliderTextField, SliderTextWrapper } from '../../../styled/Slider';

export const InterrogateSlider = () => {
  const currentThreshold = useAppSelector(selectCurrentTagScanThreshold);
  const [threshold, setThreshold] = useState<number>(currentThreshold);
  const emit = useEmitters();

  useEffect(() => {
    if (threshold === currentThreshold) return;

    const timeout = setTimeout(() => {
      emit.setSdOptions({ interrogate_deepbooru_score_threshold: threshold });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [threshold]);

  return (
    <SliderControl>
      <SliderTextWrapper>
        <SliderLabel size="small">Interrogate threshold</SliderLabel>
        <SliderTextField
          type="number"
          size="small"
          variant="standard"
          value={threshold}
          onChange={(e) => {
            setThreshold(Number(e.target.value));
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </SliderTextWrapper>
      <Slider
        min={0}
        max={1}
        step={0.01}
        size="small"
        value={threshold}
        onChange={(e, value) => {
          setThreshold(Number(value));
        }}
      />
    </SliderControl>
  );
};
