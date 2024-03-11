import styled from '@emotion/styled';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
} from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../store';
import {
  selectHRF,
  setHighResFix,
  setHRFDenoisingStrength,
  setHRFScale,
  setHRFSteps,
} from '../../../../store/reducers/inputs';
import { SliderControl, SliderLabel, SliderTextField, SliderTextWrapper } from '../../../styled/Slider';
import { UpscalerWrapper } from './UpscalersWrapper';

const StyledPaper = styled(Paper)`
  padding: 0.75rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const HighResFix = () => {
  const values = useAppSelector(selectHRF);
  const dispatch = useDispatch();

  return (
    <StyledPaper elevation={2}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            onChange={(e) => {
              dispatch(setHighResFix(e.target.checked as boolean));
            }}
          />
        }
        label="Enable high-res fix"
        value={values.enabled}
      />

      <UpscalerWrapper>
        {({ upscalers, setUpscaler }) => (
          <FormControl>
            <InputLabel size="small">Upscalers</InputLabel>
            <Select
              label="Upscalers"
              size="small"
              value={values.upscaler}
              onChange={(e: SelectChangeEvent) => {
                setUpscaler(e.target.value as string);
              }}
            >
              {upscalers.map(({ name }) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </UpscalerWrapper>

      <SliderControl>
        <SliderTextWrapper>
          <SliderLabel size="small">Scale</SliderLabel>
          <SliderTextField
            type="number"
            size="small"
            variant="standard"
            value={values.scale}
            onChange={(e) => dispatch(setHRFScale(Number(e.target.value)))}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </SliderTextWrapper>
        <Slider
          min={1}
          max={4}
          step={0.1}
          size="small"
          value={values.scale}
          onChange={(e, value) => dispatch(setHRFScale(value as number))}
        />
      </SliderControl>

      <SliderControl>
        <SliderTextWrapper>
          <SliderLabel size="small">Steps</SliderLabel>
          <SliderTextField
            type="number"
            size="small"
            variant="standard"
            value={values.steps}
            onChange={(e) => dispatch(setHRFSteps(Number(e.target.value)))}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </SliderTextWrapper>
        <Slider
          min={0}
          max={120}
          step={1}
          size="small"
          value={values.steps}
          onChange={(e, value) => dispatch(setHRFSteps(value as number))}
        />
      </SliderControl>

      <SliderControl>
        <SliderTextWrapper>
          <SliderLabel size="small">Denoising Strength</SliderLabel>
          <SliderTextField
            type="number"
            size="small"
            variant="standard"
            value={values.denoisingStrength}
            onChange={(e) => dispatch(setHRFDenoisingStrength(Number(e.target.value)))}
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
          value={values.denoisingStrength}
          onChange={(e, value) => dispatch(setHRFDenoisingStrength(value as number))}
        />
      </SliderControl>
    </StyledPaper>
  );
};
