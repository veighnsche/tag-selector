import { Box } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import { ClipSkipSlider } from './ClipSkipSlider';
import { InterrogateSlider } from './InterrogateSlider';
import { VaeDropdown } from './VaeDropdown';

export const AdvancedOptionsLayout = () => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} sm={6}>
        <Box display="flex" flexDirection="column" gap="1rem">
          <VaeDropdown />
          <ClipSkipSlider />
          <InterrogateSlider />
        </Box>
      </Grid2>
    </Grid2>
  );
};
