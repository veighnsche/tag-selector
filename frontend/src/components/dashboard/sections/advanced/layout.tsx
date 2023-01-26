import { Typography, Unstable_Grid2 as Grid } from '@mui/material'

export const AdvancedOptionsLayout = () => {
  return (
    <Grid container spacing={2}>
      <Grid xs={6}>
        <Typography variant="h6">Hypernetworks</Typography>
      </Grid>
      <Grid xs={6}>
        <Typography variant="h6">Advanced</Typography>
      </Grid>
    </Grid>
  )
}