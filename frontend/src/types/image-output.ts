export interface ImageOutputType {
  images: string[]
  parameters: {
    prompt: string
    seed: number
  }
}

export interface GetImagesPathsType {
  toIndex?: number
  amount?: number
}