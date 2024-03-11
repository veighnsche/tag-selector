import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from '../../../../hooks/useEffectOnce';
import { useEmitters } from '../../../../hooks/useEmitters';
import { useAppSelector } from '../../../../store';
import {
  selectHasOptimizerTag,
  toggleOptimizerTag,
} from '../../../../store/reducers/tags';
import { SocketEvent } from '../../../../types';
import { OptimizerTypes } from '../../../../types/image-input';
import { SdModelOptimizersType } from '../../../../types/sd-model-optimizers';
import { useSocket } from '../../../providers/SocketProvider';
import { OptimizerChip } from './OptimizerChip';

export const Optimizers = () => {
  const [{ embeddings, hypernetworks, loras, lycoris }, setOptimizers] =
    useState<SdModelOptimizersType>({
      embeddings: [],
      hypernetworks: [],
      loras: [],
      lycoris: [],
    });
  const emit = useEmitters();
  const socket = useSocket();
  const isOptimizerActive = useAppSelector(selectHasOptimizerTag);
  const dispatch = useDispatch();

  useEffectOnce(() => {
    emit.fetchOptimizers();
  });

  useEffect(() => {
    socket.on(
      SocketEvent.FETCH_OPTIMIZERS,
      (optimizers: SdModelOptimizersType) => {
        setOptimizers(optimizers);
      }
    );

    return () => {
      socket.off(SocketEvent.FETCH_OPTIMIZERS);
    };
  }, []);

  const collection = useMemo(
    () => [
      ...embeddings.map((embedding) => ({
        type: OptimizerTypes.EMBEDDING,
        name: embedding,
      })),
      ...hypernetworks.map((hypernetwork) => ({
        type: OptimizerTypes.HYPERNETWORK,
        name: hypernetwork,
      })),
      ...loras.map((lora) => ({ type: OptimizerTypes.LORA, name: lora })),
      ...lycoris.map((lycori) => ({
        type: OptimizerTypes.LYCORIS,
        name: lycori,
      })),
    ],
    [embeddings, hypernetworks, loras, lycoris]
  );

  function handleClick(optimizer: { name: string; type: OptimizerTypes }) {
    return () => {
      dispatch(toggleOptimizerTag(optimizer));
    };
  }

  return (
    <Box display="flex" flexWrap="wrap" gap="0.25rem" alignItems="center">
      {collection.map(({ type, name }) => (
        <OptimizerChip
          key={name}
          type={type}
          name={name}
          active={isOptimizerActive({ type, name })}
          onClick={handleClick({ type, name })}
        />
      ))}
    </Box>
  );
};
