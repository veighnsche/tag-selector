import { ImageCustomData, ImageCustomDataType } from 'frontend/src/types/image-custom-data';
import fs from 'fs';
import { addMetadata, getMetadata } from 'meta-png';
import { getOutputsDir } from './image-crud';

export function addMetadataToImage(uri: string, data: ImageCustomDataType): Uint8Array {
  const buffer = Buffer.from(uri, 'base64');
  const uint8Array = new Uint8Array(buffer);

  return Object.entries(omitCertainData(data)).reduce((uint8Array, [key, value]) => {
    return addMetadata(uint8Array, key, JSON.stringify(value));
  }, uint8Array);
}

export const omitCertainData = (data: ImageCustomDataType): ImageCustomDataType => {
  // omitting [ImageCustomData.PROMPT_TAGS].tagPool
  const { [ImageCustomData.PROMPT_TAGS]: { tagPool, ...promptTags }, ...rest } = data;
  return {
    ...rest, [ImageCustomData.PROMPT_TAGS]: {
      tagPool: [],
      ...promptTags,
    },
  };
};

export function fetchMetaDataFromImage(filename: string): ImageCustomDataType {
  const outputsDir = getOutputsDir();
  const filepath = `${outputsDir}\\${filename}`;
  const buffer = fs.readFileSync(filepath);
  const uit8Array = new Uint8Array(buffer);
  return Object.values(ImageCustomData).reduce((acc, key) => {
    const value = getMetadata(uit8Array, key);
    return {
      ...acc,
      [key]: value ? JSON.parse(value) : undefined,
    };
  }, {} as ImageCustomDataType);
}