import { SvgIcon } from '@mui/material';
import { ComponentProps } from 'react';

export const EmbeddingIcon = (props: ComponentProps<typeof SvgIcon>) => {
  return (
    <SvgIcon {...props}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="m24 12-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" />
    </SvgIcon>
  );
};
