import { ImageInputsType, PromptTagsType } from './image-input';

export enum ImageCustomData {
  TAGS = 'tags',
  INPUTS = 'inputs',
  PROMPT_TAGS = 'promptTags',
}

export type ImageCustomDataType = {
  [ImageCustomData.TAGS]: string[];
  [ImageCustomData.INPUTS]: ImageInputsType;
  [ImageCustomData.PROMPT_TAGS]: PromptTagsType;
};
