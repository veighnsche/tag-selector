import { SvgIcon } from '@mui/material';
import { ComponentProps } from 'react';

export const SeedIcon = (props: ComponentProps<typeof SvgIcon>) => {
  return (
    <SvgIcon {...props}>
      <path fill="none" d="M0 0H24V24H0z" />
      <path d="M22 7v2.5c0 3.59-2.91 6.5-6.5 6.5H13v5h-2v-7l.019-1c.255-3.356 3.06-6 6.481-6H22zM6 3c3.092 0 5.716 2.005 6.643 4.786-1.5 1.275-2.49 3.128-2.627 5.214H9c-3.866 0-7-3.134-7-7V3h4z" />
    </SvgIcon>
  );
};
