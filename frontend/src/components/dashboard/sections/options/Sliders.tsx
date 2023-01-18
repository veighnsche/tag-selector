import styled from '@emotion/styled'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select, SelectChangeEvent,
  Slider,
  TextField,
} from '@mui/material'
import React from 'react'
import { useAppSelector } from '../../../../store'
import { selectSliders } from '../../../../store/reducers/inputs'
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

export const Sliders = () => {
  const values = useAppSelector(selectSliders)

  return (
    <StyledPaper elevation={2}>
      <SdModelWrapper>
        {({ models, currentModel, setModel }) => {
          const handleChange = (e: SelectChangeEvent) => {
            setModel(e.target.value as string)
          }

          return (
            <FormControl>
              <InputLabel size="small">Model</InputLabel>
              <Select label="Model" size="small" value={currentModel} onChange={handleChange}>
                {models.map((model) => (
                  <MenuItem key={model.title} value={model.title}>
                    {model.model_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        }}
      </SdModelWrapper>

      <FormControl>
        <InputLabel>Steps</InputLabel>
        <Slider valueLabelDisplay="auto" min={1} max={150} size="small"/>
      </FormControl>

      <FormControl>
        <InputLabel>CFG</InputLabel>
        <Slider valueLabelDisplay="auto" min={0} max={30} step={0.1} size="small"/>
      </FormControl>

      <TextField variant="outlined" label="Seed" size="small"/>

      <FormControl>
        {/*<InputLabel size="small">Sampling method</InputLabel>*/}
        {/*<Select label="Sampling method" size="small">*/}
        {/*  <MenuItem value={10}>Ten</MenuItem>*/}
        {/*  <MenuItem value={20}>Twenty</MenuItem>*/}
        {/*  <MenuItem value={30}>Thirty</MenuItem>*/}
        {/*</Select>*/}
      </FormControl>

      <FormControlLabel control={<Checkbox size="small"/>} label="Restore faces"/>
    </StyledPaper>
  )
}