export interface TagType {
  id: string
  name: string
  strength?: number
  muted?: boolean
  hidden?: boolean
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
  tagPool: TagType[]
}
