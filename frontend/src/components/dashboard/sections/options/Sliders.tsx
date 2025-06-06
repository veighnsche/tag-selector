import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFetchImageData } from '../../../../hooks/useFetchImageData';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { selectLastSeed } from '../../../../store/reducers/images';
import {
  selectSliders,
  setCfg,
  setHeight,
  setRefinerSwitchAt,
  setRestoreFaces,
  setSeed,
  setSteps,
  setWidth,
} from '../../../../store/reducers/inputs';
import { RandomIcon } from '../../../icons/RandomIcon';
import { RecycleIcon } from '../../../icons/RecycleIcon';
import { SliderControl, SliderLabel, SliderTextField, SliderTextWrapper } from '../../../styled/Slider';
import { SamplingWrapper } from './SamplingWrapper';
import { SdModelWrapper } from './SdModelWrapper';

const StyledPaper = styled(Paper)`
    padding: 0.75rem;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
`;

export const Sliders = () => {
  const values = useAppSelector(selectSliders);
  const dispatch = useAppDispatch();
  const lastImageSeed = useAppSelector(selectLastSeed);
  const fetchImageData = useFetchImageData();

  const [heightText, setHeightText] = useState(values.height);
  const [widthText, setWidthText] = useState(values.width);

  useEffect(() => {
    if (heightText !== values.height) {
      setHeightText(values.height);
    }
    if (widthText !== values.width) {
      setWidthText(values.width);
    }
  }, [values.height, values.width]);

  const setSeedFromLastImage = async () => {
    if (lastImageSeed.seed !== undefined) {
      dispatch(setSeed(lastImageSeed.seed));
    }
    if (lastImageSeed.filename !== undefined) {
      const imageData = await fetchImageData(lastImageSeed.filename);
      if (imageData) {
        dispatch(setSeed(imageData.imageData.seed));
      }
    }
  };

  return (
    <StyledPaper elevation={2}>
      <Box display="flex" width="100%" justifyContent="space-between" alignItems="center" gap={2}>
        <FormControl variant="outlined">
          <InputLabel>Width</InputLabel>
          <OutlinedInput
            label="width"
            size="small"
            type="number"
            value={widthText}
            onChange={(e) => setWidthText(Number(e.target.value))}
            onBlur={() => dispatch(setWidth(widthText))}
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Height</InputLabel>
          <OutlinedInput
            label="height"
            size="small"
            type="number"
            value={heightText}
            onChange={(e) => setHeightText(Number(e.target.value))}
            onBlur={() => dispatch(setHeight(heightText))}
          />
        </FormControl>
      </Box>
      <SliderControl>
        <SliderTextWrapper>
          <SliderLabel size="small">Steps</SliderLabel>
          <SliderTextField
            type="number"
            size="small"
            variant="standard"
            value={values.steps}
            onChange={(e) => dispatch(setSteps(Number(e.target.value)))}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </SliderTextWrapper>
        <Slider
          min={1}
          max={150}
          size="small"
          value={values.steps}
          onChange={(e, value) => {
            dispatch(setSteps(value as number));
          }}
        />
      </SliderControl>

      <SliderControl>
        <SliderTextWrapper>
          <SliderLabel size="small">CFG</SliderLabel>
          <SliderTextField
            type="number"
            size="small"
            variant="standard"
            value={values.cfg}
            onChange={(e) => dispatch(setCfg(Number(e.target.value)))}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </SliderTextWrapper>
        <Slider
          min={0}
          max={30}
          step={0.1}
          size="small"
          value={values.cfg}
          onChange={(e, value) => {
            dispatch(setCfg(value as number));
          }}
        />
      </SliderControl>

      <FormControl variant="outlined">
        <InputLabel>Seed</InputLabel>
        <OutlinedInput
          label="Seed"
          size="small"
          type="number"
          value={values.seed}
          onChange={(e) => {
            dispatch(setSeed(Number(e.target.value) as number));
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={setSeedFromLastImage} edge="end">
                <RecycleIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  dispatch(setSeed(-1));
                }}
                edge="end"
              >
                <RandomIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <SamplingWrapper>
        {({ samplers, setSampler }) => (
          <FormControl>
            <InputLabel size="small">Sampling method</InputLabel>
            <Select
              label="Sampling method"
              size="small"
              value={values.samplingMethod}
              onChange={(e: SelectChangeEvent) => {
                setSampler(e.target.value as string);
              }}
            >
              {samplers.map(({ name }) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </SamplingWrapper>

      <SdModelWrapper>
        {({ models, currentModel, setModel, currentRefiner, setRefiner, refresh }) => (
          <>

            <FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel size="small">Model</InputLabel>
                <Select
                  label="Model"
                  size="small"
                  value={currentModel}
                  onChange={(e: SelectChangeEvent) => {
                    setModel(e.target.value as string);
                  }}
                  sx={{
                    maxWidth: '30rem',
                    flexGrow: 1,
                  }}
                >
                  {models.map((model) => (
                    <MenuItem key={model.title} value={model.title}>
                      {model.model_name}
                    </MenuItem>
                  ))}
                </Select>
                <IconButton
                  onClick={refresh}
                  edge="end"
                >
                  <RefreshIcon />
                </IconButton>
              </Box>
            </FormControl>

            <FormControl>
              <InputLabel size="small">Refiner</InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Select
                  label="Refiner"
                  size="small"
                  value={currentRefiner}
                  onChange={(e: SelectChangeEvent) => {
                    setRefiner(e.target.value as string);
                  }}
                  sx={{
                    maxWidth: '30rem',
                    flexGrow: 1,
                  }}
                >
                  {models.map((model) => (
                    <MenuItem key={model.title} value={model.title}>
                      {model.model_name}
                    </MenuItem>
                  ))}
                </Select>
                <IconButton
                  onClick={() => {
                    setRefiner('');
                  }}
                  edge="end"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </FormControl>

          </>
        )}
      </SdModelWrapper>

      <SliderControl>
        <SliderTextWrapper>
          <SliderLabel size="small">Refiner switch at</SliderLabel>
          <SliderTextField
            type="number"
            size="small"
            variant="standard"
            value={values.refinerSwitchAt}
            onChange={(e) => dispatch(setRefinerSwitchAt(Number(e.target.value)))}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </SliderTextWrapper>
        <Slider
          min={0}
          max={100}
          step={1}
          size="small"
          value={values.refinerSwitchAt}
          onChange={(e, value) => {
            dispatch(setRefinerSwitchAt(value as number));
          }}
        />
      </SliderControl>

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            onChange={(e) => {
              dispatch(setRestoreFaces(e.target.checked as boolean));
            }}
          />
        }
        label="Restore faces"
        value={values.restoreFaces}
      />
    </StyledPaper>
  );
};
