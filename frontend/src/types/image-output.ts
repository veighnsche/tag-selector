export interface ImageOutputType {
  images: string[]
  parameters: {
    prompt: string
  }
}

export interface GetImagesPathsType {
  toIndex?: number
  amount?: number
}