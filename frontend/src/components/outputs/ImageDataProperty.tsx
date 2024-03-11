import styled from '@emotion/styled';
import { Button, Tooltip } from '@mui/material';
import React, { ReactElement } from 'react';

const StyledButton = styled(Button)<{
  fullWidth?: boolean;
}>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '50%')};
  font-weight: normal;
  text-transform: none;
  border-radius: 0;
`;

interface ImageDataPropertyProps {
  name: string;
  fullWidth?: boolean;
  value: any;
  variant: 'contained' | 'outlined';
  toggle: () => void;
}

export const ImageDataProperty = ({
  name,
  value,
  fullWidth,
  variant,
  toggle,
}: ImageDataPropertyProps) => {
  const display = value.toString().slice(0, 50);
  const isLonger = value.toString().length > 50;

  const TooltipWrapper = ({ children }: { children: ReactElement }) => {
    if (!isLonger) {
      return <>{children}</>;
    }
    return <Tooltip title={value.toString()}>{children}</Tooltip>;
  };

  return (
    <TooltipWrapper>
      <StyledButton
        fullWidth={fullWidth}
        size="small"
        variant={variant}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <span style={{ fontWeight: 500 }}>{name}:</span> {display}
        {isLonger ? '...' : ''}
      </StyledButton>
    </TooltipWrapper>
  );
};
