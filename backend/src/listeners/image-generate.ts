import axios, { AxiosError } from 'axios'
import { ImageInputsType, ImageOutputType, TagType } from 'frontend/src/types'
import { ImageGenerateParams } from 'frontend/src/types/image-generate-params'
import { PromptTagsType } from 'frontend/src/types/image-input'
import { SdProgressType } from 'frontend/src/types/sd-progress'
import { SD_URL } from '../constants'

function tagToPrompt(tag: TagType): string {
  if (tag.muted) {
    return ''
  }
  if (tag.strength === undefined || tag.strength === 100) {
    return tag.name
  }
  return `(${tag.name}:${tag.strength / 100})`
}

export const selectTagsForInputs = ({
  tags, negativeTags, scene, negativePrompt,
}: {
  tags: TagType[]
  negativeTags: TagType[]
  scene: string
  negativePrompt: string
}) => {
  return {
    prompt: [scene.trim(), ...tags.map(tagToPrompt)].filter(Boolean).join(', '),
    negative: [negativePrompt.trim(), ...negativeTags.map(tagToPrompt)].filter(Boolean).join(', '),
  }
}


export function imageGenerate({
  prompt: { scene, negativePrompt },
  options: { width, height, steps, cfg, seed, restoreFaces, samplingMethod },
}: ImageInputsType, {
  tags,
  negativeTags,
}: PromptTagsType): Promise<ImageOutputType> {
  console.time('generateImage')

  const { prompt, negative } = selectTagsForInputs({
    tags,
    negativeTags,
    scene: scene,
    negativePrompt: negativePrompt,
  })

  const params: ImageGenerateParams = {
    prompt,
    negative_prompt: negative,
    steps,
    width,
    height,
    cfg_scale: cfg,
    seed,
    restore_faces: restoreFaces,
    sampler_index: samplingMethod,
  }

  return axios.post(`${SD_URL}/sdapi/v1/txt2img`, params)
  .then(response => {
    console.timeEnd('generateImage')
    return response.data
  })
  .then((imageOutput: ImageOutputType) => ({
    ...imageOutput,
    info: JSON.parse(imageOutput.info as unknown as string),
  }))
  .catch((error: AxiosError) => {
    console.error('Error while generating image:', error)
    console.timeEnd('generateImage')
    throw error
  })
}

export function getProgress(): Promise<SdProgressType> {
  return axios.get(`${SD_URL}/sdapi/v1/progress`)
  .then(response => response.data)
}

export function interruptImageGenerate(): Promise<void> {
  return axios.post(`${SD_URL}/sdapi/v1/interrupt`)
}