import { AxiosError } from 'axios';
import { ImageInputsType, PromptTagsType } from 'frontend/src/types/image-input';
import { SdStatus } from 'frontend/src/types/sd-status';
import { SocketEvent } from 'frontend/src/types/socket-event';
import { Socket } from 'socket.io';
import { INTERROGATE_URL, SD_URL } from '../constants';
import { getNextIndex, saveImage } from '../utils/image-crud';
import { getProgress, imageGenerate, interruptImageGenerate, withSeedNumber } from '../utils/image-generate';
import { imageInterrogate } from '../utils/image-interrogate';
import { addMetadataToImage } from '../utils/image-metadata';

export function imageGenerateController(socket: Socket) {
  return async ({ inputs: inputsWithoutSeed, tags: promptTags }: { inputs: ImageInputsType, tags: PromptTagsType }) => {

    socket.emit(SocketEvent.SD_STATUS, SdStatus.BUSY);
    const nextIndexPromise = getNextIndex();

    const progressInterval = setInterval(async () => {
      const progress = await getProgress();
      socket.emit(SocketEvent.PROGRESS_IMAGE, progress.current_image);
      socket.emit(SocketEvent.PROGRESS_ETA, progress.eta_relative);
      socket.emit(SocketEvent.PROGRESS_PERCENT, progress.progress);
    }, 9900);

    const inputs = withSeedNumber(inputsWithoutSeed);
    const imageOutput = await imageGenerate(inputs, promptTags)
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.SD_STATUS, SdStatus.ERROR);
      socket.emit(SocketEvent.ERROR, { error });
      throw error;
    });

    clearInterval(progressInterval);
    socket.emit(SocketEvent.IMAGE_OUTPUT_BASE64, { imageOutput });
    socket.emit(SocketEvent.PROGRESS_ETA, 0);
    socket.emit(SocketEvent.PROGRESS_PERCENT, 0);

    if (SD_URL !== INTERROGATE_URL) {
      socket.emit(SocketEvent.SD_STATUS, SdStatus.READY);
    }

    const imagePathsPromise = Promise.all(imageOutput.images.map(async (uri, index) => {
      const tags = await imageInterrogate(uri);
      const uint8ArrayWithTags = addMetadataToImage(uri, { tags, inputs, promptTags });
      const buffer = Buffer.from(uint8ArrayWithTags);

      const nextIndex = await nextIndexPromise;
      const imageIndex = nextIndex + index;
      const imageFilename = await saveImage({ buffer, index: imageIndex, imageOutput });
      socket.emit(SocketEvent.IMAGE_OUTPUT, { images: [imageFilename] });
    }));

    if (SD_URL === INTERROGATE_URL) {
      await imagePathsPromise;
      socket.emit(SocketEvent.SD_STATUS, SdStatus.READY);
    }
  };
}

export function generateImageInterruptController(socket: Socket) {
  return async () => {
    interruptImageGenerate()
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.ERROR, { error });
    });
  };
}