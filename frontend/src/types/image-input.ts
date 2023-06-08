export enum OptimizerTypes {
  EMBEDDING = 'embedding',
  HYPERNETWORK = 'hypernetwork',
  LORA = 'lora',
  LYCORIS = 'lycoris',
}

export type DynamicTagType = {
  positive: TagType[]
  negative: TagType[]
}[]

export interface TagType {
  id: string
  name: string
  strength?: number
  muted?: boolean
  hidden?: boolean
  optimizer?: OptimizerTypes
  dynamic?: DynamicTagType
}

export interface EmbeddingType extends TagType {
  optimizer: OptimizerTypes.EMBEDDING
}

export interface HypernetworkType extends TagType {
  optimizer: OptimizerTypes.HYPERNETWORK
}

export interface LoraType extends TagType {
  optimizer: OptimizerTypes.LORA
}

export interface LycorisType extends TagType {
  optimizer: OptimizerTypes.LYCORIS
}

export interface ImageOptionsType {
  width: number
  height: number
  steps: number
  cfg: number
  seed: number
  samplingMethod: string
  restoreFaces: boolean
  highResFix: HighResFixType
}

export interface HighResFixType {
  enabled: boolean
  upscaler: string
  scale: number
  steps: number
  denoisingStrength: number
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
