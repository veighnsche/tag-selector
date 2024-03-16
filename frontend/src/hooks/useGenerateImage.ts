import { useAppSelector } from '../store';
import { selectInputs } from '../store/reducers/inputs';
import { selectSdStatus } from '../store/reducers/sdStatus';
import { selectAllTags } from '../store/reducers/tags';
import { SdStatus } from '../types';
import { useEmitters } from './useEmitters';

export function useGenerateImage() {
  const inputs = useAppSelector(selectInputs);
  const sdStatus = useAppSelector(selectSdStatus);
  const tags = useAppSelector(selectAllTags);
  const emit = useEmitters();

  return () => {
    if (sdStatus === SdStatus.READY) {
      emit.generateImage(inputs, tags);
    }
  };
}
