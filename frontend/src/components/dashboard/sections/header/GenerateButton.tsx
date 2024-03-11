import styled from '@emotion/styled';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useGenerateImage } from '../../../../hooks/useGenerateImage';
import { useAppSelector } from '../../../../store';
import { selectSdStatus } from '../../../../store/reducers/sdStatus';
import { SdStatus, SocketEvent } from '../../../../types';
import { useSocket } from '../../../providers/SocketProvider';

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'busy',
})<{
  busy: boolean;
}>`
  width: 10rem;
  text-transform: ${({ busy }) => (busy ? 'none' : 'uppercase')};
`;

export const GenerateButton = () => {
  const sdStatus = useAppSelector(selectSdStatus);
  const generateImage = useGenerateImage();
  const socket = useSocket();
  const [eta, setEta] = useState<string | null>();

  useEffect(() => {
    socket.on(SocketEvent.PROGRESS_ETA, (seconds) => {
      if (seconds === 0) {
        setEta(null);
        return;
      }

      const minutes = Math.floor(seconds / 60);
      const secondsLeft = Math.floor(seconds % 60);
      setEta(`${minutes}m ${secondsLeft}s`);
    });

    return () => {
      socket.off('progressPercent');
    };
  }, []);

  function handleClick() {
    generateImage();
  }

  return (
    <StyledButton
      busy={!!eta}
      variant="contained"
      onClick={handleClick}
      disabled={sdStatus === SdStatus.BUSY}
    >
      {eta ? `${eta}` : 'Generate one'}
    </StyledButton>
  );
};
