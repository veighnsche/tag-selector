export interface TagType {
  name: string
  strength: number
}

export interface ImageOptionsType {
  width: number
  height: number
  steps: number
  cfg: number
  seed: number
  samplingMethod: string
  restoreFaces: boolean
}

export interface ImageInputsType {
  prompt: {
    scene: string,
    negativePrompt: string,
  }
  options: ImageOptionsType
}

export interface PromptTagsType {
  tags: TagType[]
  negativeTags: TagType[]
}