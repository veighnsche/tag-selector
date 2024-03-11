import { useSocket } from '../components/providers/SocketProvider';
import { useAppDispatch, useAppSelector } from '../store';
import { selectImageCustomData, selectImageData, setImageData } from '../store/reducers/images';
import { SocketEvent } from '../types';
import { FetchImageDataType } from '../types/fetch-image-data';
import { FullImageDataType } from '../types/image-data';
import { extractFileIndex, prefixWithImageUrl } from '../utils/files';
import { useEmitters } from './useEmitters';

export function useFetchImageData() {
  const socket = useSocket();
  const dataSelector = useAppSelector(selectImageData);
  const customerDataSelector = useAppSelector(selectImageCustomData);
  const dispatch = useAppDispatch();
  const emit = useEmitters();

  return (filename: string): Promise<FullImageDataType> => {
    const imageData = dataSelector(filename);
    const customData = customerDataSelector(filename);
    if (imageData && customData) {
      return Promise.resolve({ imageData, customData });
    }

    const fileIndex = extractFileIndex(filename);

    return new Promise((resolve) => {
      socket.on(
        `${SocketEvent.FETCH_IMAGE_DATA}-${fileIndex}`,
        ({ imageData, tagSelectorData }: FetchImageDataType) => {
          socket.off(`${SocketEvent.FETCH_IMAGE_DATA}-${fileIndex}`);
          dispatch(setImageData({ filename, imageData, tagSelectorData }));
          resolve({ imageData, customData: tagSelectorData });
        }
      );

      emit.fetchImageData({
        fileName: filename,
        fileIndex,
        filePath: prefixWithImageUrl(filename),
      });
    });
  };
}
