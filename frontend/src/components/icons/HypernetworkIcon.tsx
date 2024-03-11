import { SvgIcon } from '@mui/material';
import { ComponentProps } from 'react';

export const HypernetworkIcon = (props: ComponentProps<typeof SvgIcon>) => {
  return (
    <SvgIcon {...props}>
      <path
        d="M12 20
      c-4.41 0-8-3.59-8-8
      s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8
      m0-18
      C6.48 2 2 6.48 2 12
      s4.48 10 10 10 10-4.48 10-10
      S17.52 2 12 2
      m4.24 5.76
      A5.95 5.95 0 0 0 12 6
      v6l-4.24 4.24
      a6 6 0 0 0 8.48 0 6 6 0 0 0 0-8.48
      Z"
      />
    </SvgIcon>
  );
};
