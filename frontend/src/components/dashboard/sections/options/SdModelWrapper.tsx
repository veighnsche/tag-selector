import React, { ReactNode, useEffect, useState } from 'react';
import { useEffectOnce } from '../../../../hooks/useEffectOnce';
import { useEmitters } from '../../../../hooks/useEmitters';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { selectRefinerCheckpoint, setRefinerCheckpoint } from '../../../../store/reducers/inputs';
import { selectCurrentModel } from '../../../../store/reducers/sdOptions';
import { SocketEvent } from '../../../../types';
import { SdModelType } from '../../../../types/sd-models';
import { useSocket } from '../../../providers/SocketProvider';
import { Loading } from '../../Loading';

interface SdModelWrapperProps {
  children: (props: SdModelWrapperChildrenProps) => ReactNode;
}

interface SdModelWrapperChildrenProps {
  refresh: () => void;
  models: SdModelType[];
  currentModel: SdModelType['title'];
  setModel: (model: SdModelType['title']) => void;
  currentRefiner: SdModelType['title'];
  setRefiner: (refiner: SdModelType['title']) => void;
}

export const SdModelWrapper = ({ children }: SdModelWrapperProps) => {
  const socket = useSocket();
  const [models, setModels] = useState<SdModelType[]>([]);
  const [loading, setLoading] = useState(models.length === 0);
  const currentModel = useAppSelector(selectCurrentModel);
  const currentRefiner = useAppSelector(selectRefinerCheckpoint);
  const emit = useEmitters();
  const dispatch = useAppDispatch();

  useEffectOnce(() => {
    if (models.length === 0) {
      emit.fetchSdModels();
    }
  });

  useEffect(() => {
    socket.on(SocketEvent.FETCH_SD_MODELS, ({ models }: { models: SdModelType[] }) => {
      console.log('models', models)
      setModels(models);
      setLoading(false);
    });

    return () => {
      socket.off(SocketEvent.FETCH_SD_MODELS);
    };
  }, []);

  useEffect(() => {
    if (currentModel) {
      setLoading(false);
    }
  }, [currentModel]);

  function setModel(model: SdModelType['title']) {
    setLoading(true);
    emit.setSdOptions({ sd_model_checkpoint: model });
  }

  function setRefiner(refiner: SdModelType['title']) {
    dispatch(setRefinerCheckpoint(refiner));
  }

  function refresh() {
    setLoading(true);
    emit.fetchSdModels();
  }

  if (loading) {
    return <Loading subject={'models'} />;
  }

  return <>{children({ models, currentModel, setModel, currentRefiner, setRefiner, refresh })}</>;
};
