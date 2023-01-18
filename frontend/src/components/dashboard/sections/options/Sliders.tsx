import styled from '@emotion/styled'
import {
  Checkbox,
  FormControl, FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'

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
  return (
    <StyledPaper elevation={2}>
      <Typography variant="caption">Steps</Typography>
      <Slider valueLabelDisplay="auto" min={1} max={150}/>

      <Typography variant="caption">CFG</Typography>
      <Slider  valueLabelDisplay="auto" min={0} max={30} step={0.1}/>

      <TextField variant="outlined" label="Seed"/>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Sampling method
        </InputLabel>
        <Select label="Sampling method">
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel control={<Checkbox />} label="Restore faces" />
    </StyledPaper>
  )
}