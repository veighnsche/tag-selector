import { SvgIcon } from '@mui/material';
import { ComponentProps } from 'react';

export const RandomIcon = (props: ComponentProps<typeof SvgIcon>) => {
  return (
    <SvgIcon {...props}>
      <path d="M4,17 C3.44771525,17 3,16.5522847 3,16 C3,15.4477153 3.44771525,15 4,15 L6,15 L9,12 L6,9 L4,9 C3.45000005,9 3,8.55245148 3,8.00122564 C3,7.44999981 3.45000005,7 4,7 L7,7 L11,11 L15,7 L17,7 L17,5 L21,8.00122564 L17,11 L17,9 L16,9 L13,12 L16,15 L17,15 L17,13 L21,16 L17,19 L17,17 L15,17 L11,13 L7,17 L4,17 Z" />
    </SvgIcon>
  );
};
