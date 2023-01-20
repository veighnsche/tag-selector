export enum ImageCustomData {
  TAGS = "tags",
}

export type ImageCustomDataType = {
  [ImageCustomData.TAGS]: string[];
}