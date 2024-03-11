import { ReactNode, useEffect, useState } from 'react';
import { useEffectOnce } from '../../../../hooks/useEffectOnce';
import { useEmitters } from '../../../../hooks/useEmitters';
import { useAppDispatch } from '../../../../store';
import { setHRFUpscaler } from '../../../../store/reducers/inputs';
import { SocketEvent } from '../../../../types';
import { SdUpscalersType } from '../../../../types/sd-upscalers';
import { useSocket } from '../../../providers/SocketProvider';
import { Loading } from '../../Loading';

interface UpscalerWrapperProps {
  children: (props: UpscalerWrapperChildrenProps) => ReactNode;
}

interface UpscalerWrapperChildrenProps {
  upscalers: SdUpscalersType[];
  setUpscaler: (upscaling: string) => void;
}

export const UpscalerWrapper = ({ children }: UpscalerWrapperProps) => {
  const socket = useSocket();
  const [upscalers, setUpscalers] = useState<SdUpscalersType[]>([]);
  const [loading, setLoading] = useState(upscalers.length === 0);
  const emit = useEmitters();
  const dispatch = useAppDispatch();

  useEffectOnce(() => {
    if (upscalers.length === 0) {
      emit.fetchUpscalers();
    }
  });

  useEffect(() => {
    socket.on(SocketEvent.FETCH_UPSCALERS, ({ upscalers }: { upscalers: SdUpscalersType[] }) => {
      setUpscalers(upscalers);
      setLoading(false);
    });

    return () => {
      socket.off(SocketEvent.FETCH_UPSCALERS);
    };
  }, []);

  const setUpscaler = (upscaling: string) => {
    dispatch(setHRFUpscaler(upscaling));
  };

  if (loading) {
    return <Loading subject={'upscaling methods'} />;
  }

  return <>{children({ upscalers, setUpscaler })}</>;
};
