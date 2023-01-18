import styled from '@emotion/styled'
import CasinoIcon from '@mui/icons-material/Casino'
import {
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
} from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store'
import { selectSliders, setCfg, setRestoreFaces, setSeed, setSteps } from '../../../../store/reducers/inputs'
import { SamplingWrapper } from './SamplingWrapper'
import { SdModelWrapper } from './SdModelWrapper'

const StyledPaper = styled(Paper)`
  padding: 0.75rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`

const SliderLabel = styled(InputLabel)`
  transform: translateY(-0.5rem);
`

export const Sliders = () => {
  const values = useAppSelector(selectSliders)
  const dispatch = useAppDispatch()

  return (
    <StyledPaper elevation={2}>
      <SdModelWrapper>
        {({ models, currentModel, setModel }) => (
          <FormControl>
            <InputLabel size="small">Model</InputLabel>
            <Select
              label="Model"
              size="small"
              value={currentModel}
              onChange={(e: SelectChangeEvent) => {
                setModel(e.target.value as string)
              }}
            >
              {models.map((model) => (
                <MenuItem key={model.title} value={model.title}>
                  {model.model_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </SdModelWrapper>

      <FormControl>
        <SliderLabel>Steps</SliderLabel>
        <Slider
          valueLabelDisplay="on"
          min={1}
          max={150}
          size="small"
          value={values.steps}
          onChange={(e, value) => {
            dispatch(setSteps(value as number))
          }}
        />
      </FormControl>

      <FormControl>
        <SliderLabel>CFG</SliderLabel>
        <Slider
          valueLabelDisplay="on"
          min={0}
          max={30}
          step={0.1}
          size="small"
          value={values.cfg}
          onChange={(e, value) => {
            dispatch(setCfg(value as number))
          }}
        />
      </FormControl>

      <FormControl variant="outlined">
        <InputLabel>Seed</InputLabel>
        <OutlinedInput
          label="Seed"
          size="small"
          type="number"
          value={values.seed}
          onChange={(e) => {
            dispatch(setSeed(Number(e.target.value) as number))
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  dispatch(setSeed(-1))
                }}
                edge="end"
              >
                <CasinoIcon/>
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
                setSampler(e.target.value as string)
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

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            onChange={(e) => {
              dispatch(setRestoreFaces(e.target.checked as boolean))
            }}
          />
        }
        label="Restore faces"
        value={values.restoreFaces}
      />
    </StyledPaper>
  )
}