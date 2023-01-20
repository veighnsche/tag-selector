import { ImageCustomDataType } from './image-custom-data'
import { ImageOptionsType } from './image-input'

export interface ImageDataType extends Partial<ImageOptionsType> {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  modeHash: string;
  model: string;
  modelHash: string;
  seed: number;
}

export interface ImageDataRequestType {
  fileName: string,
  fileIndex: number,
  filePath: string
}

export interface FullImageDataType {
  imageData: ImageDataType;
  customData: ImageCustomDataType
}