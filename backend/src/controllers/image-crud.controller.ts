import { GetImagesPathsType } from 'frontend/src/types/image-output';
import { SocketEvent } from 'frontend/src/types/socket-event';
import { Socket } from 'socket.io';
import { getImagesPaths, removeImage } from '../utils/image-crud';


interface FetchImageControllerOptions {
  isModal?: boolean;
}

export function fetchImageController(socket: Socket, { isModal = false }: FetchImageControllerOptions = {}) {
  return async (data: GetImagesPathsType) => {
    const images = await getImagesPaths(data)
    .catch((error: Error) => {
      socket.emit(SocketEvent.ERROR, { error });
    });
    socket.emit(SocketEvent.FETCH_IMAGES, { images });

    if (isModal) {
      socket.emit(SocketEvent.FETCH_IMAGES_MODAL, { nextImage: images?.[0] });
    }
  };
}

export function removeImageController(socket: Socket) {
  return async (data: { fileName: string }) => {
    removeImage(data.fileName)
    .catch((error: Error) => {
      socket.emit(SocketEvent.ERROR, { error });
    });
  };
}
