import { SvgIcon } from '@mui/material';
import { ComponentProps } from 'react';
import ExtensionIcon from '@mui/icons-material/Extension';

export const LoraIcon = (props: ComponentProps<typeof SvgIcon>) => {
  return (
    <SvgIcon {...props}>
      <ExtensionIcon />
    </SvgIcon>
  );
};
