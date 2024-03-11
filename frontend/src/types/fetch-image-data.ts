import { ImageCustomDataType } from './image-custom-data';
import { ImageDataType } from './image-data';

export interface FetchImageDataType {
  imageData: ImageDataType;
  tagSelectorData: ImageCustomDataType;
}
