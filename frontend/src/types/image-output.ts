export interface ImageOutputType {
  images: string[]
  parameters: {
    prompt: string
    seed: number
  }
  info: ImageOutputInfoType
}

export interface ImageOutputInfoType {
  seed: number
  width: number
  height: number
}

export interface GetImagesPathsType {
  toIndex?: number
  amount?: number
}