import CloudIcon from '@mui/icons-material/Cloud';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setSdStatus } from '../../../../store/reducers/sdStatus';
import { selectSocketStatus, SocketStatus } from '../../../../store/reducers/socketStatus';
import { SdStatus } from '../../../../types';

export const ConnectionStatus = () => {
  const socketStatus = useAppSelector(selectSocketStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socketStatus) {
      dispatch(setSdStatus(SdStatus.ERROR));
    } else {
      dispatch(setSdStatus(SdStatus.READY));
    }
  }, [socketStatus]);

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
