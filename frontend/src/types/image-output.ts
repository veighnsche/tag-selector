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
}

export interface GetImagesPathsType {
  toIndex?: number
  amount?: number
}