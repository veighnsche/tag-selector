import CloudIcon from '@mui/icons-material/Cloud';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import React from 'react';
import { useAppSelector } from '../../../../store';
import {
  selectSocketStatus,
  SocketStatus,
} from '../../../../store/reducers/socketStatus';

export const ConnectionStatus = () => {
  const socketStatus = useAppSelector(selectSocketStatus);

  return (
    <>
      {socketStatus === SocketStatus.CONNECTED ? (
        <CloudIcon sx={{ color: 'green' }} />
      ) : (
        <CloudOffIcon sx={{ color: 'red' }} />
      )}
    </>
  );
};
