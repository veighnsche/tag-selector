import { TextField } from '@mui/material';
import React from 'react';

export const Loading = ({ subject }: { subject: string }) => {
  return (
    <TextField
      variant="outlined"
      label={`Loading ${subject}...`}
      size="small"
      disabled
    />
  );
};
