import { ReactNode, useEffect } from 'react';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useEmitters } from '../../hooks/useEmitters';
import { useAppDispatch } from '../../store';
import { setSdOptions } from '../../store/reducers/sdOptions';
import { setSdStatus } from '../../store/reducers/sdStatus';
import { SdStatus, SocketEvent } from '../../types';
import { SdOptionsType } from '../../types/sd-options';
import { useSocket } from './SocketProvider';

interface SdOptionsProviderProps {
  children: ReactNode;
}

export const SdOptionsProvider = ({ children }: SdOptionsProviderProps) => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const emit = useEmitters();

  useEffect(() => {
    socket.on(SocketEvent.SD_STATUS, (status: SdStatus) => {
      dispatch(setSdStatus(status));
    });

    return () => {
      socket.off(SocketEvent.SD_STATUS);
    };
  }, []);

  useEffectOnce(() => {
    emit.fetchSdOptions();
  });

  useEffect(() => {
    socket.on(SocketEvent.FETCH_SD_OPTIONS, ({ options }: { options: SdOptionsType }) => {
      dispatch(setSdOptions({ options }));
    });

    return () => {
      socket.off(SocketEvent.FETCH_SD_OPTIONS);
    };
  }, []);

  useEffect(() => {
    socket.on(SocketEvent.ERROR, (error: any) => {
      console.error(error);
    });

    return () => {
      socket.off(SocketEvent.ERROR);
    };
  }, []);

  return <>{children}</>;
};
